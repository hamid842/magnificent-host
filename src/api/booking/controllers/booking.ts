/**
 * booking controller
 */

import { factories } from '@strapi/strapi'
import moment from 'moment';
import { DATE_FORMAT, TCalendar, TReservationPriceCalculationResponse } from '../../../utils/APITypes';
import HostawayAPI from '../../../utils/HostawayAPI';
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const stripeEndpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const formatDate = (date: Date): string => {
  return moment(date).format('dddd, MMMM Do YYYY');
}

export default factories.createCoreController('api::booking.booking', ({strapi}) => ({
  //====================================================================================================
  /**
   * Override the 'create' REST handler
   * POST /bookings
   * NOTE:
   *    -guest: null -> get logged in user's information from users table (by userId) and add as guest (if doesn't exist in guests)
   *    -guest: not-null -> add  new guest to guests table and use userId (logged in user) in guest record
   * data: {
   *    userId
   *    propertyId
   *    arrival
   *    departure
   *    numberOfGuests
   *    couponName,
   *    guest: { (OPTIONAL)
   *      fullName,
   *      email,
   *      phoneNumber,
   *    },
   *    additionalInformation (OPTIONAL)
   * }
   */
  async create(ctx) {
    // Extract required fields from the body of the POST request
    const {
      userId,
      propertyId,
      arrival,
      departure,
      numberOfGuests,
      couponName,
      guest,
      additionalInformation
    } = ctx.request.body;
    // Validate inputs
    if (!userId) return ctx.badRequest(`You must be logged in and provide User Id.`);
    if (!propertyId) return ctx.badRequest(`You must provide the Property Id that you want to book.`);
    if (!arrival) return ctx.badRequest(`Arrival Date must be provided`);
    if (!moment(arrival, DATE_FORMAT, true).isValid()) return ctx.badRequest(`Arrival Date is not a valid date ${DATE_FORMAT}`);
    if (!departure) return ctx.badRequest(`Arrival Date must be provided`);
    if (!moment(departure, DATE_FORMAT, true).isValid()) return ctx.badRequest(`Departure Date is not a valid date ${DATE_FORMAT}`);
    if (!numberOfGuests) return ctx.badRequest(`Number of Guests must be provided`);
    if (typeof numberOfGuests !== 'number') return ctx.badRequest(`Number of Guests must be a number`);
    if (guest) {
      if (!guest.fullName) return ctx.badRequest(`When creating a custom guest data: the Fullname must be provided.`);
      if (!guest.email) return ctx.badRequest(`When creating a custom guest data: the Email Address must be provided.`);
      if (!guest.phoneNumber) return ctx.badRequest(`When creating a custom guest data: the Phone Number must be provided.`);
    }

    //--------------------------------------------------------------------------------------------------
    try {
      // TODO: Should we create a reservation on Hostaway (pending) here ? (Block calendar)
    //--------------------------------------------------------------------------------------------------
      const arrivalDate = new Date(arrival);
      arrivalDate.setHours(0, 0, 0, 0);
      const departureDate = new Date(departure);
      departureDate.setHours(0, 0, 0, 0);

      const totalNights = moment.duration(moment(departure).diff(moment(arrival))).asDays();
      // Important: check dates are correct
      if (totalNights < 0) {
        throw new Error(`Arrival date (${arrival}) is not before departure date (${departure})`);
      }
      //--------------------------------------------------------------------------------------------------
      // Check: if the arrival date is in the past throw error
      const fromNow = moment.duration(moment(arrival).diff(moment(new Date()))).asDays();
      // TODO: Check the below logic (might break for different hours of the day)
      // Using Math.ceil() because depending on the hour of the day, today might be considered past (Math.ceil(0.33) = 0)
      if (Math.ceil(fromNow) < 0) {
        throw new Error(`Arrival date (${arrival}) is in the past`);
      }
      //--------------------------------------------------------------------------------------------------
      // Check if property is correct
      const property = await strapi.db.query('api::property.property').findOne({
        where: {
          id: propertyId
        },
        populate: ['images'],
      });

      if (!property) {
        throw new Error(`Property with the ID of ${propertyId} doesn't exist.`);
      }
      //--------------------------------------------------------------------------------------------------
      // Check with Hostaway to see if this property is available (before going for payment)
      const calendar: TCalendar[] = await HostawayAPI.getCalendar(
        property.id,
        arrivalDate,
        departureDate
      );
      calendar.forEach((day: TCalendar) => {
        if (day.isAvailable == 0) throw new Error(`The Listing is not available on "${formatDate(new Date(day.date))}"`);
      });
      //--------------------------------------------------------------------------------------------------
      // Get pricing details
      const prices: TReservationPriceCalculationResponse = await HostawayAPI.calculateReservationPrice(
        propertyId,
        arrivalDate,
        departureDate,
        numberOfGuests,
        couponName
      );

      //--------------------------------------------------------------------------------------------------
      // Create guest
      // NOTE: For every booking we create a new guest
      // get user info based on userId
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: userId }
      });
      // If no user was found:
      if (!user) throw new Error(`No user with userId of ${userId} found`);

      // Declare the variable. It will be defined in the if-else blocks below
      let guestEntry;

      if (guest) {
        // Guest information was passed with request
        const { fullName, email, phoneNumber } = guest;
        // Create new guest in db
        guestEntry = await strapi.db.query('api::guest.guest').create({
          data: {
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            additionalInformation: additionalInformation,
            // Create relation with user
            user: {
              connect: { id: user.id }
            }
          }
        });
      } else {
        // No guest data was passed with the request so we'll use the user's data
        guestEntry = await strapi.db.query('api::guest.guest').create({
          data: {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            additionalInformation: additionalInformation,
            // Create relation with user
            user: {
              connect: { id: user.id }
            }
          }
        });
      }
      // Now we have a Guest object (either created from data of the request, or from the users table)
      //--------------------------------------------------------------------------------------------------
      // Create booking (connect with guest)
      const booking = await strapi.db.query('api::booking.booking').create({
        data: {
          bookingDate: new Date(),
          arrivalDate: arrivalDate,
          departureDate: departureDate,
          totalNights: totalNights,
          // Create relation
          property: {
            connect: { id: property.id }
          },
          // Create relation
          guest: {
            connect: { id: guestEntry.id }
          },
          price: prices
        }
      });
      //--------------------------------------------------------------------------------------------------
      // Create stripe session
      // LINK: https://stripe.com/docs/api/checkout/sessions/create?lang=node
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        expires_at: moment().add(30, 'minute').unix(), // FOR TESTING: Expire in 30 Minutes
        customer_email: guestEntry.email,
        success_url: process.env.CLIENT_URL + `/receipt/${booking.id}?success=true`,
        cancel_url: process.env.CLIENT_URL + `/receipt/${booking.id}?success=false`,
        line_items: [
          {
            price_data: {
              currency: 'aed',
              product_data: {
                name: property.Title,
                metadata: {
                  booking_id: booking.id,
                },
                description: `Booking "${property.Title}" for "${totalNights}" nights from "${formatDate(arrivalDate)}" to "${formatDate(departureDate)}"`,
                images: property.images.map((item, idx) => { // Add first 4 images of the product
                  if (idx >= 4) return;
                  return item.url;
                })
              },
              unit_amount: Math.round(prices.totalPrice * 100), // Must multiply by 100, because it accepts cents
            },
            quantity: 1
          }
        ],
      });
      //--------------------------------------------------------------------------------------------------
      // Create payment (payed: false) (add stripeId)
      const payment = await strapi.db.query('api::payment.payment').create({
        data: {
          stripeSessionId: session.id,
          amount: session.amount_total,
          sessionCreatedAt: new Date(session.created * 1000), // Because the value is in UNIX Timestamp (Seconds)
          sessionExpiresAt: new Date(session.expires_at * 1000), // Because the value is in UNIX Timestamp (Seconds)
          // Create relation
          booking: {
            connect: { id: booking.id }
          },
          status: 'PENDING'
        }
      });
      //--------------------------------------------------------------------------------------------------
      return { stripeId: session.id, stripeUrl: session.url };
    } catch (error) {
      return ctx.internalServerError(error.message, error);
    }
    //--------------------------------------------------------------------------------------------------
  },

  //====================================================================================================
  //====================================================================================================

  /**
   * Webhook called automatically by Stripe
   */
  async payment(ctx) {
    try {
      // Event object is the body of the request sent to this webhook
      let event = ctx.request.body;
      //--------------------------------------------------------------------------------------------
      /**
       * TODO: Must enable validation here.
       * Validate Webhook request: (Optional)
       *    Why? The body already has the event data, but to make sure it's from Stripe, we will validate it with a signature from the header
       *    For this to work, we need access to the raw body of the request (unparsed).
       *      LINK: https://forum.strapi.io/t/get-raw-request-body-in-custom-controller/14560/2
       *      1-in ./config/middlewares.ts:
       *        a-remove: 'strapi::body',
       *        b-add: { name: 'strapi::body', config: { includeUnparsed: true } },
       *      2-Here:
       *        a-add: const unparsed = require('koa-body/unparsed.js');
       *        b-add: <the codes below>
       */
      // // Get the unparsed body of the request
      // const unparsedBody = ctx.request.body[unparsed];
      // // Get the signature sent by Stripe
      // const signature = ctx.request.headers['stripe-signature'];
      // Over-write the event object with the validated one
      // event = stripe.webhooks.constructEvent(unparsedBody, signature, stripeEndpointSecret);
      //--------------------------------------------------------------------------------------------
      // Handle the event
      // NOTE: For each event.type value, the event.data.object would be a different type (session, payment_intent)
      // LINK: https://stripe.com/docs/api/events/types
      if (event.type === 'checkout.session.completed') {
        //------------------------------------------------------------------------------------------
        // Occurs when a Checkout Session has been successfully completed.
        // NOTE: In this event type: 'data.object' is a 'checkout session'
        // LINK: https://stripe.com/docs/api/events/object
        const session = event.data.object;
        // Find payment, booking from db by sessionId
        // 1-Update status: SUCCESS
        const payment = await strapi.db.query('api::payment.payment').update({
          where: { stripeSessionId: session.id },
          data: { status: 'SUCCESS', sessionResolvedAt: new Date(), stripePaymentIntentId: session.payment_intent },
          populate: ['booking']
        });
        // 2-Sync Booking with Hostaway
        const { booking } = payment;
        // 3-Update Booking -> Add Hostaway id for the reservation to the Booking
        // 4-Update Booking -> syncedWithHostaway: true
        return { message: 'Success' };
        //------------------------------------------------------------------------------------------
      } else if (event.type === 'checkout.session.expired') {
        //------------------------------------------------------------------------------------------
        // Occurs when a Checkout Session has been successfully completed.
        // NOTE: In this event type: 'data.object' is a 'checkout session'
        // LINK: https://stripe.com/docs/api/events/object
        const session = event.data.object;
        // Find payment, booking from db by sessionId
        // 1-Update status: EXPIRED
        const payment = await strapi.db.query('api::payment.payment').update({
          where: { stripeSessionId: session.id },
          data: { status: 'EXPIRED', sessionResolvedAt: new Date(), stripePaymentIntentId: session.payment_intent },
          populate: ['booking']
        });
        // 2-Update / Remove Booking
        const { booking } = payment;
        // 3-Free up the calendar (listing)
        return { message: 'expired' };
        //------------------------------------------------------------------------------------------
      } else if (event.type === 'checkout.session.async_payment_succeeded') {
        //------------------------------------------------------------------------------------------
        // Other event types
        // console.log('> async_payment_succeeded')
        //------------------------------------------------------------------------------------------
      } else if (event.type === 'checkout.session.async_payment_failed') {
        //------------------------------------------------------------------------------------------
        // Other event types
        // console.log('> async_payment_failed')
        //------------------------------------------------------------------------------------------
      }
      //--------------------------------------------------------------------------------------------
    } catch (err) {
      ctx.response.status = 500;
      const errMsg = `[Stripe Webhook failed] →\n ${err.message}`;
      console.log(errMsg);
      return { error: errMsg };
    }
  }
  //====================================================================================================
}));

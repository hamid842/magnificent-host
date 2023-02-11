/**
 * booking controller
 */

import { factories } from '@strapi/strapi'
import moment from 'moment';
import { TReservationPriceCalculationResponse } from '../../../utils/APITypes';
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
   * data: {
   *    userId
   *    propertyId
   *    arrival
   *    departure
   *    numberOfGuests
   *    couponCode
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
      couponName
    } = ctx.request.body;
    //--------------------------------------------------------------------------------------------------
    try {
      // TODO: Should we create a reservation on Hostaway (pending) here ?
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
      // TODO: Check with Hostaway to see if this property is available (before going for payment)
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
      // Get pricing details
      const prices: TReservationPriceCalculationResponse = await HostawayAPI.calculateReservationPrice(
        propertyId,
        arrivalDate,
        departureDate,
        numberOfGuests,
        couponName
      );

      //--------------------------------------------------------------------------------------------------
      // Create or Find guest (by userId)

      // Try to find Guest from the database (based on userId)
      const guests = await strapi.db.query('api::guest.guest').findMany({
        where: {
          user: {
            id: userId
          },
        }
      });

      // Declare the variable. It will be defined in the if-else blocks below
      let guest: any;

      if (guests && guests.length) {
        // Guest already exists
        guest = guests[0];
      } else {
        // Guest doesn't exist, must create it based on user.
        // get user info based on userId
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: {
            id: userId
          }
        });
        // If no user was found:
        if (!user) throw new Error(`No user with userId of ${userId} found`);
        // create a new Guest based on information from User table
        guest = await strapi.db.query('api::guest.guest').create({
          data: {
            fullName: user.username, // TODO: Must add fullName to user so that it could be used here instead of username
            email: user.email,
            phoneNumber: '01234567890', // TODO: Must add phoneNumber to user so that it could be used here
            additionalInformation: '', // TODO: What should I put here?
            // Create relation with user
            user: {
              connect: { id: user.id }
            }
          }
        });
      }
      // Now we have a Guest object (either newly created, or from db)
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
            connect: { id: guest.id }
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
        customer_email: guest.email,
        success_url: process.env.CLIENT_URL + `/last-minute-deals/${propertyId}?booking=${booking.id}&payed=true`,
        cancel_url: process.env.CLIENT_URL + `/last-minute-deals/${propertyId}?booking=${booking.id}&payed=false`,
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
          // Create relation
          booking: {
            connect: { id: booking.id }
          }
        }
      });
      //--------------------------------------------------------------------------------------------------
      return { stripeId: session.id, stripeUrl: session.url };
    } catch (error) {
      ctx.response.status = 500;
      return { error: String(error) };
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
        // Occurs when a Checkout Session has been successfully completed.
        // NOTE: In this event type: 'data.object' is a 'checkout session'
        // LINK: https://stripe.com/docs/api/events/object
        const session = event.data.object;
        // Find payment, booking from db by sessionId
        // Update isPayed: true
        const payment = await strapi.db.query('api::payment.payment').update({
          where: { stripeSessionId: session.id },
          data: { isPayed: true },
          populate: ['booking']
        });
        // Sync Booking with Hostaway
        const { booking } = payment;
        // Update Booking -> syncedWithHostaway: true
        return { message: 'Success' };
      } else {
        // Other event types
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

import moment from "moment";
import { DATE_FORMAT } from "./APITypes";

const templates = {
  booking: {
    subject: 'Magnificent: Booking Success!',
    text: `
          Thank you for choosing Magnificent.
          You have successfully booked: "<%= property.Title %>" (ID: <%= property.id %> ) \n
          For <%= booking.totalNights %> night(s), from <%= booking.arrivalDate %> to <%= booking.departureDate %>. \n
          Address: <%= property.address %> \n
          ------------------ \n
          Guest Information:
          ------------------ \n
          Fullname: <%= guest.fullName %> \n
          Email: <%= guest.email %> \n
          Phone Number: <%= guest.phoneNumber %> \n
          Additional Information: \n
          <%= guest.additionalInformation %> \n

          ------------------ \n
          Pricing Details: \n
          ------------------ \n
          <%= price.components %> \n
          Total Cost: <%= price.totalPrice %> \n
          \n
          ----------------------- \n
          Stripe Payment Intent: <%= payment.stripePaymentIntentId %> \n
          ----------------------- \n
          Magnificent Payment ID: <%= payment.id %> \n
          ----------------------- \n
          Magnificent Booking ID: <%= booking.id %> \n
          `,
    html: `
    <h1>Thank you for choosing Magnificent.</h1> <br />
    You have successfully booked: <strong>"<%= property.Title %>"</strong> (ID: <strong><%= property.id %></strong> ) <br />
    For <strong><%= booking.totalNights %></strong> night(s), from <strong><%= booking.arrivalDate %></strong> to <strong><%= booking.departureDate %></strong>. <br />
    <strong>Address:</strong> <%= property.address %> <br />
    <hr />
    <strong>Guest Information:</strong> <br />
    <hr />
    <strong>Fullname:</strong>  <%= guest.fullName %> <br />
    <strong>Email:</strong>  <%= guest.email %> <br />
    <strong>Phone Number:</strong>  <%= guest.phoneNumber %> <br />
    <strong>Additional Information:</strong> <br />
    <%= guest.additionalInformation %> <br />

    <hr />
    <strong>Pricing Details:</strong> <br />
    <hr />
    <%= price.components %> <br />
    <strong>Total Cost: <%= price.totalPrice %></strong> <br />

    <hr />
    <strong>Stripe Payment Intent:</strong> <%= payment.stripePaymentIntentId %> <br />
    <hr />
    <strong>Magnificent Payment ID:</strong> <%= payment.id %> <br />
    <hr />
    <strong>Magnificent Booking ID:</strong> <%= booking.id %> <br />
    `,
  },
  new_property: {
    subject: 'Magnificent: New Property Under Review!',
    text: `
    Your new property will be reviewed by our team, and as soon as it is approved, we will contact you \n
    ------------------------ \n
    Property: \n
    ------------------------ \n
    Type: <%= property.property_type.name %> \n
    Title: <%= property.Title %> \n
    Square Meters: <%= property.squareMeters %> \n
    Bedrooms: <%= property.bedroomsNumber %> \n
    Bathrooms: <%= property.bathroomsNumber %> \n
    Price: <%= property.price %> \n
    Address: <%= property.contact.contactAddress %> \n

    ------------------------- \n
    User Information: \n
    ------------------------- \n
    First Name: <%= property.contact.contactName %> \n
    Last Name: <%= property.contact.contactSurName %> \n
    Phone Number: <%= property.contact.contactPhone1 %> \n
    Email: <%= property.contact.contactEmail %> \n
    `,
    html: `
    Your new property will be reviewed by our team, and as soon as it is approved, we will contact you. <br />
    <hr />
    <strong>Property:</strong>
    <hr />
    <strong>Type:</strong> <%= property.property_type.name %> <br />
    <strong>Title:</strong> <%= property.Title %> <br />
    <strong>Square Meters:</strong> <%= property.squareMeters %> <br />
    <strong>Bedrooms:</strong> <%= property.bedroomsNumber %> <br />
    <strong>Bathrooms:</strong> <%= property.bathroomsNumber %> <br />
    <strong>Price:</strong> <%= property.price %> <br />
    <strong>Address:</strong> <%= property.contact.contactAddress %> <br />

    <hr />
    <strong>User Information:</strong>
    <hr />
    <strong>First Name:</strong> <%= property.contact.contactName %> <br />
    <strong>Last Name:</strong> <%= property.contact.contactSurName %> <br />
    <strong>Phone Number:</strong> <%= property.contact.contactPhone1 %> <br />
    <strong>Email:</strong> <%= property.contact.contactEmail %> <br />
    `,
  },
};

// ========================================================================================
/**
 * Send booking completed emails to host and guest after payment is successful
 */
export const sendBookingSuccess = async (payment) => {
  // --------------------------------------------------------------------------------------
  const { booking } = payment;
  const { guest, property } = booking;
  // --------------------------------------------------------------------------------------
  // Data used to compile template
  const data = {
    property: {
      Title: property.Title,
      id: property.id,
      address: property.address.address
    },
    booking: {
      id: booking.id,
      totalNights: booking.totalNights,
      arrivalDate: moment(booking.arrivalDate).format(DATE_FORMAT),
      departureDate: moment(booking.departureDate).format(DATE_FORMAT)
    },
    guest: {
      fullName: guest.fullName,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      additionalInformation: guest.additionalInformation
    },
    payment: {
      id: payment.id,
      stripePaymentIntentId: payment.stripePaymentIntentId
    },
    price: {
      totalPrice: booking.price.totalPrice,
      components: booking.price.components.map((comp) => `${comp.title}: ${comp.total} <br />`).join('') // Convert array to string
    }
  };
  // --------------------------------------------------------------------------------------
  // Send email to guest
  await strapi.plugins['email'].services.email.sendTemplatedEmail(
    // Email destination and source
    { to: guest.email },
    // Template name
    templates.booking,
    // Data used to compile template
    data
  );
  // --------------------------------------------------------------------------------------
  // Send email to host
  // TODO: Don't have Host Email
};

// ========================================================================================

/**
 * Send Email to user when they create a NewProperty
 */
export const sendNewProperty = async (entity) => {
  await strapi.plugins['email'].services.email.sendTemplatedEmail(
    // Email destination and source
    { to: entity.contact.contactEmail },
    // Template name
    templates.new_property,
    // Data used to compile template
    {
      property: entity
    }
  );
};

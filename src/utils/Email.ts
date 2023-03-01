const templates = {
  booking_guest: {
    subject: 'Welcome Magnificent!',
    text: `Welcome to Magnificent!

          Your account is now linked with: <%= user.email %>.`,
    html: `<h1>Welcome to Magnificent!</h1>
          <h2><%= user.fullName %></h2>
          <p>Your account is now linked with: <%= user.email %>.<p>`,
  },
  booking_host: {
    subject: '',
    text: ``,
    html: ``,
  },
};

/**
 * Send booking completed emails to host and guest after payment is successful
 */
export const sendBookingSuccess = async () => {
  // Guest
  // Host
};

// TODO: Rent your place confirmation

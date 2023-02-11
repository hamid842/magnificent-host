export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/bookings/payment',
      handler: 'booking.payment',
      config: {
        auth: false, // Accessible without authentication
      },
    }
  ]
}

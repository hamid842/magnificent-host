export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/properties/:id/calendar',
      handler: 'property.getCalendar',
      config: {
        auth: false, // Accessible without authentication
      },
    },
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/properties/:id/price',
      handler: 'property.getPrices',
      config: {
        auth: false, // Accessible without authentication
      },
    }
  ]
}

export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/properties/:id/calendar',
      handler: 'property.getCalendar',
    }
  ]
}

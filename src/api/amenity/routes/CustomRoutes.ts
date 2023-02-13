export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/all-amenities',
      handler: 'amenity.getAll',
      config: {
        auth: false, // Accessible without authentication
      },
    }
  ]
}

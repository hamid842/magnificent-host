export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/all-property-types',
      handler: 'property-type.getAll',
      config: {
        auth: false, // Accessible without authentication
      },
    }
  ]
}

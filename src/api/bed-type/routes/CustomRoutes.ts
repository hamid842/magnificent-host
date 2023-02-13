export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/all-bed-types',
      handler: 'bed-type.getAll',
      config: {
        auth: false, // Accessible without authentication
      },
    }
  ]
}

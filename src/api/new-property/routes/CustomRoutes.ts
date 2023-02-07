export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/new-properties/:id/approve',
      handler: 'new-property.approve',
    },
  ]
}

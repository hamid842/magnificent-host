export default {
 // Generate the sitemap every 12 hours
  '0 */12 * * *': () => {
    strapi.plugin('sitemap').service('core').createSitemap();
  },
};

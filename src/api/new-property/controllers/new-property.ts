/**
 * new-property controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::new-property.new-property', ({ strapi }) =>  ({
  /**
   * Custom controller action to Approve a NewProperty and Post it to Hostaway
   * POST - /new-properties/:id/approve
   */
  async approve(ctx) {
    // TODO: MUST COMPLETE
    return 'NOT YET';
  },

  //=======================================================================================================

}));

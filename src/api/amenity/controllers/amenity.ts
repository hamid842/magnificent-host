/**
 * amenity controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::amenity.amenity', ({ strapi }) =>  ({
  //=======================================================================================================

  /**
   * Custom controller action to return all amenities (no pagination)
   * GET - /all-amenities
   */
    async getAll(ctx) {
      const amenities = await strapi.entityService.findMany('api::amenity.amenity');
      const slim = amenities.map((item) => {
        return { id: item.id, name: item.name };
      })
      return slim;
    },

  //=======================================================================================================
}));

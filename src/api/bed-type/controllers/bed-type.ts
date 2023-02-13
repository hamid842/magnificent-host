/**
 * bed-type controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::bed-type.bed-type', ({ strapi }) =>  ({
  //=======================================================================================================

  /**
   * Custom controller action to return all bed-types (no pagination)
   * GET - /all-bed-types
   */
    async getAll(ctx) {
      const bedTypes = await strapi.entityService.findMany('api::bed-type.bed-type');
      const slim = bedTypes.map((item) => {
        return { id: item.id, name: item.name };
      })
      return slim;
    },

  //=======================================================================================================
}));

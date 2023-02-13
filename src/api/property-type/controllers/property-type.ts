/**
 * property-type controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::property-type.property-type', ({ strapi }) =>  ({
  //=======================================================================================================

  /**
   * Custom controller action to return all property-types (no pagination)
   * GET - /all-property-types
   */
    async getAll(ctx) {
      const propertyTypes = await strapi.entityService.findMany('api::property-type.property-type');
      const slim = propertyTypes.map((item) => {
        return { id: item.id, name: item.name };
      })
      return slim;
    },

  //=======================================================================================================
}));

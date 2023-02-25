/**
 * amenity controller
 */

import { factories } from '@strapi/strapi'

// TODO: Temp code (remove when database is finalized)
const cleanIcon = (amenity) => {
  let icon: string = amenity.attributes.icon;
  if (!icon) return;

  icon = icon.replace('<span class="material-symbols-outlined">', '');
  icon = icon.replace('</span>', '');
  icon = icon.trim();
  amenity.attributes.icon = icon;
};

export default factories.createCoreController('api::amenity.amenity', ({ strapi }) =>  ({
  //=======================================================================================================
  // TODO: Temp Code
  /**
  * Wrap core controller in custom logic
  */
  async findOne(ctx) {
    // Calling the default core action
    const { data, meta } = await super.findOne(ctx);

    cleanIcon(data);

    return { data, meta };
  },
  //=======================================================================================================
  // TODO: Temp Code
  /**
   * Wrap core controller in custom logic
   */
  async find(ctx) {
    // Calling the default core action
    const { data, meta } = await super.find(ctx);

    for (const amenity of data) {
      cleanIcon(amenity);
    }

    return { data, meta };
  },
  //=======================================================================================================

  /**
   * Custom controller action to return all amenities (no pagination)
   * GET - /all-amenities
   */
    async getAll(ctx) {
      const amenities = await strapi.entityService.findMany('api::amenity.amenity');
      const slim = amenities.map((item) => {
        return { id: item.id, name: item.name, category: item.category, icon: item.icon };
      })
      // TODO: Temp Code
      for (const amenity of slim) {
        let icon: string = amenity.icon;
        if (!icon) continue;
        icon = icon.replace('<span class="material-symbols-outlined">', '');
        icon = icon.replace('</span>', '');
        icon = icon.trim();
        amenity.icon = icon;
      }
      return slim;
    },

  //=======================================================================================================
}));

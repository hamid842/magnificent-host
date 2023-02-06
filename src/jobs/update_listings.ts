import { downloadListings, downloadPropertyTypes, downloadAmenities, downloadBedTypes } from '../utils/Sync';

export default {
  /**
  * Shallow Search: Just see if the id of the listing exists, if not create it
  * Run this job every 1 Minute(s)
  * TODO: MOVE IN PRODUCTION
  */
  '*/1 * * * *': async ({ strapi }) => {
    //-------------------------------------------------------------------------------------------------
    // TODO: TEMP: Only import items if there isn't any in the DB
    //-------------------------------------------------------------------------------------------------
    const amenities = await strapi.entityService.findMany('api::amenity.amenity', { fields: ['id'] });
    if (!amenities.length) await downloadAmenities();
    //-------------------------------------------------------------------------------------------------
    const propertyTypes = await strapi.entityService.findMany('api::property-type.property-type', { fields: ['id'] });
    if (!propertyTypes.length) await downloadPropertyTypes();
    //-------------------------------------------------------------------------------------------------
    const bedTypes = await strapi.entityService.findMany('api::bed-type.bed-type', { fields: ['id'] });
    if (!bedTypes.length) await downloadBedTypes();
    //-------------------------------------------------------------------------------------------------
    const listings = await strapi.entityService.findMany('api::property.property', { fields: ['id'] });
    if (!listings.length) await downloadListings();
  },

  /**
  * Deep Comparison: See if Property items need any updates
  * Run this job every 60 Minute(s)
  */
  '*/60 * * * *': async ({ strapi }) => {

  },
};

import HostawayAPI from "../utils/HostawayAPI";
import { TCalendar, TListing } from "../utils/APITypes";

export default {
  /**
  * Shallow Search: Just see if the id of the listing exists, if not create it
  * Run this job every 1 Minute(s)
  */
  '*/1 * * * *': async ({ strapi }) => {
    //-------------------------------------------------------------------------
    console.log('Retrieve all listings: ');
    const propertyUUID = 'api::property.property';
    const listings: TListing[] = await HostawayAPI.getListings();
    for (const listing of listings) {
      const entry = await strapi.entityService.findOne(propertyUUID, listing.id);
      if (!entry) {
        const newEntry = await strapi.entityService.create(propertyUUID, {
          data: {
            id: listing.id,
            Title: listing.name,
            location: listing.address,
            generalInformation: {},
            publishedAt: new Date(), // To publish the entry
          },
        });
      }
    }
    //-------------------------------------------------------------------------
  },

  /**
  * Deep Comparison: See if Property items need any updates
  * Run this job every 60 Minute(s)
  */
  '*/60 * * * *': async ({ strapi }) => {
    console.log('Deep Comparison!');
  },
};

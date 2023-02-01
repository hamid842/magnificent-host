import HostawayAPI from "../utils/HostawayAPI";
import { TCalendar, TListing } from "../utils/APITypes";

export default {
  /**
   * Run this job every 1 Minute(s)
   */
  '*/1 * * * *': async ({ strapi }) => {
    //-------------------------------------------------------------------------
    console.log('Retrieve all listings: ');
    const listings: TListing[] = await HostawayAPI.getListings();
    for (const listing of listings) {
      console.log(`${listing.id} → ${listing.name}`);
    }
    //-------------------------------------------------------------------------
    console.log('===================================');
    console.log('Retrieve one listing: ');
    const listing: TListing = await HostawayAPI.getListing(listings[1].id);
    console.log(`${listing.id} → ${listing.name}`);
    //-------------------------------------------------------------------------
    console.log('===================================');
    console.log('Retrieve one Calendar: ');
    const calendars: TCalendar[] = await HostawayAPI.getCalendar(
      listings[1].id,
      new Date('2023-01-31'),
      new Date('2023-02-3')
    );
    for (const calendar of calendars) {
      console.log(`${calendar.date} → ${calendar.isAvailable}`);
    }
  },
};

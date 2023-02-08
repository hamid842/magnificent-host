/**
 * property controller
 */

import { factories } from '@strapi/strapi'
import { TBoolean, TCalendar, TReservationPriceCalculationResponse } from '../../../utils/APITypes';
import HostawayAPI from '../../../utils/HostawayAPI';

export default factories.createCoreController('api::property.property', ({ strapi }) =>  ({
  /**
   * Custom controller action to retrieve the calendar array of a Property from Hostaway API
   * GET - /properties/:id/calendar?startDate=...&endDate=....&onlyBlocked=(1/true)
   */
  async getCalendar(ctx) {
    const { id } = ctx.request.params;
    // onlyBlocked {boolean [0 | 1]} -> if true, only returns blocked dates
    const { startDate, endDate, onlyBlocked } = ctx.request.query;

    console.log(`Calendar of Listing: ${id} between: ${startDate} - ${endDate}`);

    const calendar: TCalendar[] = await HostawayAPI.getCalendar(
      id,
      new Date(startDate),
      new Date(endDate)
      );

    // We just need a summary info of the date and status, so we remove unnecessary info
    type TSlimCalendar = { date: string, isAvailable: TBoolean };
    let slimCalendar: TSlimCalendar[] = calendar.map((item: TCalendar) => {
      return {
        date: item.date,
        isAvailable: item.isAvailable
      };
    });

    // If onlyBlocked queryParam was set to true (1), filter the array to just contained dates with isAvailable=0
    if (onlyBlocked && (onlyBlocked === 1 || onlyBlocked === 'true')) {
      slimCalendar = slimCalendar.filter((item: TSlimCalendar) => {
        return !item.isAvailable;
      });
    }
    return slimCalendar;
  },

  //=======================================================================================================

  /**
   * Custom controller action to create the pricing details of a Property from Hostaway API
   * GET - /properties/:id/price?guestCount=...&startDate=...&endDate=....&couponName=...
   */
    async getPrices(ctx) {
      const { id } = ctx.request.params;
      const { guestCount, startDate, endDate, couponName } = ctx.request.query;

      console.log(`Price of Listing: ${id} between: ${startDate} - ${endDate} for ${guestCount} People`);

      const prices: TReservationPriceCalculationResponse = await HostawayAPI.calculateReservationPrice(
        id,
        new Date(startDate),
        new Date(endDate),
        guestCount,
        couponName
      );

      return prices;
    },

  //=======================================================================================================
}));

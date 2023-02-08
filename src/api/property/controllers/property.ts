/**
 * property controller
 */

import { factories } from '@strapi/strapi'
import { TBoolean, TCalendar, TReservationPriceCalculationResponse } from '../../../utils/APITypes';
import HostawayAPI from '../../../utils/HostawayAPI';

export default factories.createCoreController('api::property.property', ({ strapi }) =>  ({
  /**
   * Custom controller action to retrieve the calendar array of a Property from Hostaway API
   * GET - /properties/:id/calendar?startDate=...&endDate=....
   */
  async getCalendar(ctx) {
    const { id } = ctx.request.params;
    const { startDate, endDate } = ctx.request.query;

    console.log(`Calendar of Listing: ${id} between: ${startDate} - ${endDate}`);

    const calendar: TCalendar[] = await HostawayAPI.getCalendar(
      id,
      new Date(startDate),
      new Date(endDate)
      );

    // We just need a summary info of the date and status, so we remove unnecessary info
    const slimCalendar: { date: string, isAvailable: TBoolean }[] = calendar.map((item: TCalendar) => {
      return {
        date: item.date,
        isAvailable: item.isAvailable
      };
    });
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

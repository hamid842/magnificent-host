/**
 * property controller
 */

import { factories } from '@strapi/strapi'
import moment from 'moment';
import { DATE_FORMAT, TBoolean, TCalendar, TReservationPriceCalculationResponse } from '../../../utils/APITypes';
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
    // Validate inputs
    if (!startDate) return ctx.badRequest(`Arrival Date must be provided`);
    if (!moment(startDate, DATE_FORMAT, true).isValid()) return ctx.badRequest(`Arrival Date is not a valid date ${DATE_FORMAT}`);
    if (!endDate) return ctx.badRequest(`Departure Date must be provided`);
    if (!moment(endDate, DATE_FORMAT, true).isValid()) return ctx.badRequest(`Departure Date is not a valid date ${DATE_FORMAT}`);

    // console.log(`Calendar of Listing: ${id} between: ${startDate} - ${endDate}`);

  let calendar: TCalendar[] = [];
  try {
    calendar = await HostawayAPI.getCalendar(
      id,
      new Date(startDate),
      new Date(endDate)
      );
  } catch (error) {
    ctx.internalServerError(error.message, error);
  }

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
      // Validate inputs (using 'moment(dateStr, dateFormat, true)' to validate a date and its format)
      if (!guestCount) return ctx.badRequest(`Guest Count must be provided`);
      if (!startDate) return ctx.badRequest(`Arrival Date must be provided`);
      if (!moment(startDate, DATE_FORMAT, true).isValid()) return ctx.badRequest(`Arrival Date is not a valid date ${DATE_FORMAT}`);
      if (!endDate) return ctx.badRequest(`Departure Date must be provided`);
      if (!moment(endDate, DATE_FORMAT, true).isValid()) return ctx.badRequest(`Departure Date is not a valid date ${DATE_FORMAT}`);

      // console.log(`Price of Listing: ${id} between: ${startDate} - ${endDate} for ${guestCount} People`);
      let prices: TReservationPriceCalculationResponse;

      try {
        prices = await HostawayAPI.calculateReservationPrice(
          id,
          new Date(startDate),
          new Date(endDate),
          guestCount,
          couponName
        );
      } catch (error) {
        return ctx.internalServerError(error.message, error);
      }

      return prices;
    },

  //=======================================================================================================
}));

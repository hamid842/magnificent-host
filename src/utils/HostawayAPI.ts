import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import querystring from 'querystring';
import { DATE_FORMAT, TAmenity, TBedType, TCalendar, TCreateReservationCouponRequest, TCreateReservationCouponResponse, TListing, TPropertyType, TReservation, TReservationPriceCalculationRequest, TReservationPriceCalculationResponse } from './APITypes';

/**
 * + 'status' can be one of:
 *    - 'success' if case of no errors occurred or
 *    - 'fail' in case of any error.
 * + 'result' contains:
 *    - endpoint result if no errors
 *    - an error message string if status is fail.
 */
type TResponse = {
  status: 'success' | 'fail',
  result: any | string,
};

interface IAxiosResponse {
  data: TResponse;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

export default class HostawayAPI {
  private static accessToken: { expires_in: number, access_token: string} | undefined;

  private static readonly BASE = 'https://api.hostaway.com/v1';

  private static readonly HOSTAWAY_ID = 45126;
  private static readonly HOSTAWAY_SECRET = 'b7109d9ba26e990f2489a8bfaf78dba521a76b3985ac2f59cbbb716fef33be23';


  private static async init(): Promise<void> {
    console.log('Getting new access token!'); // TODO: Remove
    try {
      //------------------------------------------------
      // Encode the API request data
      const data = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: HostawayAPI.HOSTAWAY_ID,
        client_secret: HostawayAPI.HOSTAWAY_SECRET,
        scope: 'general',
      });
      //------------------------------------------------
      // Send API request and wait for the response
      const res = await axios.post(`${HostawayAPI.BASE}/accessTokens`,
      data,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Cache-control': 'no-cache',
        }
      });
      //------------------------------------------------
      // Extract fields from the API response
      const { expires_in, access_token } = res.data;
      //------------------------------------------------
      HostawayAPI.accessToken = {
        expires_in,
        access_token,
      };
      //------------------------------------------------
    } catch (error) {
      console.log('[Error while getting AccessToken from Hostaway] → \n', error);
    }
  }

  //===========================================================================================================

  /**
  * Retrieves a list of Listings on the Hostaway waebsite
  * GET /listings
  *
  * Link: https://api.hostaway.com/documentation?javascript#retrieve-a-listings-list
  */
  public static async getListings(): Promise<TListing[]> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken ) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const response: IAxiosResponse = await axios.get(`${HostawayAPI.BASE}/listings`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving a list of Listings from Hostaway] → \n', error);
      return [];
    }
  }

  //===========================================================================================================

  /**
  * Retrieves a Listing from the Hostaway waebsite
  * GET /listings/:listingId
  *
  * Link: https://api.hostaway.com/documentation?javascript#retrieve-a-listing
  */
  public static async getListing(listingId: number): Promise<TListing> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const response: IAxiosResponse = await axios.get(`${HostawayAPI.BASE}/listings/${listingId}`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving a Listing from Hostaway] → \n', error);
      return undefined;
    }
  }

  //===========================================================================================================

  /**
  * Retrieves the calendar of a Listing from the Hostaway waebsite
  * Calendar is just an array of calendar day objects (TCalendar) for dates selected.
  * GET /listings/:listingId/calendar
  *
  * Link: https://api.hostaway.com/documentation?javascript#retrieve-a-calendar
  */
  public static async getCalendar(listingId: number, startDate: Date, endDate: Date): Promise<TCalendar[]> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken ) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const response: IAxiosResponse = await axios.get(`${HostawayAPI.BASE}/listings/${listingId}/calendar`, {
        params: {
          startDate: HostawayAPI.getFormattedDate(startDate),
          endDate: HostawayAPI.getFormattedDate(endDate),
        },
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving a list of Calendar from Hostaway] → \n', error);
      return [];
    }
  }

  private static getFormattedDate(date: Date): string {
    return moment(date).format(DATE_FORMAT);
  };

  //===========================================================================================================

  /**
  * Retrieves a list of amenities from the Hostaway waebsite
  * GET /amenities
  *
  * Link: https://api.hostaway.com/documentation?javascript#retrieve-an-amenities-list
  */
  public static async getAmenities(): Promise<TAmenity[]> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const response: IAxiosResponse = await axios.get(`${HostawayAPI.BASE}/amenities`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving list of Amenities from Hostaway] → \n', error);
      return [];
    }
  }

  //===========================================================================================================

  /**
  * Retrieves a list of bed-types from the Hostaway waebsite
  * GET /bedTypes
  *
  * Link: https://api.hostaway.com/documentation?javascript#retrieve-a-bed-types-list
  */
  public static async getBedTypes(): Promise<TBedType[]> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const response: IAxiosResponse = await axios.get(`${HostawayAPI.BASE}/bedTypes`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving list of Amenities from Hostaway] → \n', error);
      return [];
    }
  }

  //===========================================================================================================

  /**
  * Retrieves a list of property-types from the Hostaway waebsite
  * GET /propertyTypes
  *
  * Link: https://api.hostaway.com/documentation?javascript#property-types
  */
  public static async getPropertyTypes(): Promise<TPropertyType[]> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const response: IAxiosResponse = await axios.get(`${HostawayAPI.BASE}/propertyTypes`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving list of Amenities from Hostaway] → \n', error);
      return [];
    }
  }

  //===========================================================================================================

  /**
  * Create a Reservation on the Hostaway waebsite
  * POST /reservations
  *
  * Query parameters {
  *   forceOverbooking:	(optional) - int[0,1] | boolean - Ignore overbooking protection
  * }
  *
  * Link: https://api.hostaway.com/documentation#create-a-reservation
  */
    public static async createReservation(reservation: TReservation, forceOverbooking: boolean = true): Promise<TReservation> {
      // If there's no accessToken, get a new token
      if (!HostawayAPI.accessToken ) {
        await HostawayAPI.init();
      }
      //------------------------------------------------
      try {
        const forceOverbookingParam: string = (forceOverbooking ? '1' : '0');
        const response: IAxiosResponse = await axios.post(`${HostawayAPI.BASE}/reservations?forceOverbooking=${forceOverbookingParam}`,
        JSON.stringify(reservation),
        {
          headers: {
            'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
            'Cache-control': 'no-cache',
            'Content-Type': 'application/json',
          }
        });
        //------------------------------------------------
      // Handle API Error response
      if (response.data.status === 'fail') throw new Error(response.data.result);
      // Successful request -> Return the data
        return response.data.result;
      } catch (error) {
        console.log('[Error while creating a Reservation on Hostaway] → \n', error);
        return null;
      }
    }

  //===========================================================================================================

  /**
  * Get Reservation Price Details (Reservation Price Calculator)
  * POST /listings/{listingId}/calendar/priceDetails
  *
  *
  * Link: https://api.hostaway.com/documentation?javascript#reservation-price-calculation
  */
  public static async calculateReservationPrice(
      listingId: number,
      startingDate: Date,
      endingDate: Date,
      numberOfGuests: number,
      couponName?: string
    ): Promise<TReservationPriceCalculationResponse> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken ) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    // If a coupon name is provided, get the couponId from the Hostaway API
    let couponId = null;
    if (typeof(couponName) !== 'undefined' && couponName.trim() !== '') {
      const couponResponse: TCreateReservationCouponResponse = await HostawayAPI.getCouponId(couponName, listingId, startingDate, endingDate);
      if (couponResponse) couponId = couponResponse.reservationCouponId;
    }
    //------------------------------------------------
    const data: TReservationPriceCalculationRequest = {
      startingDate: HostawayAPI.getFormattedDate(startingDate),
      endingDate: HostawayAPI.getFormattedDate(endingDate),
      numberOfGuests: numberOfGuests,
      version: 2,
    };

    // If there's a couponId, add it to the request object
    if (couponId) {
      data.reservationCouponId = couponId;
    }

    try {
      const response: IAxiosResponse = await axios.post(`${HostawayAPI.BASE}/listings/${listingId}/calendar/priceDetails`,
      JSON.stringify(data),
      {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache',
          'Content-Type': 'application/json',
        }
      });
      //------------------------------------------------
    // Handle API Error response
    if (response.data.status === 'fail') throw new Error(response.data.result);
    // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while getting Reservation Price Details from Hostaway] → \n', error);
      return null;
    }
  }

  /**
  * Get the couponId from Hostaway
  * POST /reservationCoupons
  *
  *
  * Link: https://api.hostaway.com/documentation?javascript#create-reservation-coupon-object
  */
  private static async getCouponId(
    couponName: string,
    listingId: number,
    startingDate: Date,
    endingDate?: Date
  ): Promise<TCreateReservationCouponResponse> {
    // If there's no accessToken, get a new token
    if (!HostawayAPI.accessToken ) {
      await HostawayAPI.init();
    }
    //------------------------------------------------
    try {
      const data: TCreateReservationCouponRequest = {
        couponName: couponName,
        listingMapId: listingId,
        startingDate: HostawayAPI.getFormattedDate(startingDate),
      };

      // If endingDate was provided, add it to the request object
      if (typeof(endingDate) !== 'undefined') {
        data.endingDate = HostawayAPI.getFormattedDate(endingDate);
      }
      //------------------------------------------------
      const response: IAxiosResponse = await axios.post(`${HostawayAPI.BASE}/reservationCoupons`,
      JSON.stringify(data),
      {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache',
          'Content-Type': 'application/json',
        }
      });
      //------------------------------------------------
    // Handle API Error response
    if (response.data.status === 'fail') throw new Error(response.data.result);
    // Successful request -> Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while getting a CouponId from Hostaway] → \n', error);
      return null;
    }
  }

  //===========================================================================================================

}


import axios from 'axios';
import querystring from 'querystring';
import { TAmenity, TBedType, TCalendar, TListing, TPropertyType } from './APITypes';

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
      const response = await axios.get(`${HostawayAPI.BASE}/listings`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Return the data
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
      const response = await axios.get(`${HostawayAPI.BASE}/listings/${listingId}`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Return the data
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
      const response = await axios.get(`${HostawayAPI.BASE}/listings/${listingId}/calendar`, {
        params: {
          startDate: HostawayAPI.formatDate(startDate),
          endDate: HostawayAPI.formatDate(endDate),
        },
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving a list of Calendar from Hostaway] → \n', error);
      return [];
    }
  }

  private static formatDate(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

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
      const response = await axios.get(`${HostawayAPI.BASE}/amenities`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Return the data
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
      const response = await axios.get(`${HostawayAPI.BASE}/bedTypes`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Return the data
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
      const response = await axios.get(`${HostawayAPI.BASE}/propertyTypes`, {
        headers: {
          'Authorization': `Bearer ${HostawayAPI.accessToken.access_token}`,
          'Cache-control': 'no-cache'
        }
      });
      //------------------------------------------------
      // Return the data
      return response.data.result;
    } catch (error) {
      console.log('[Error while retrieving list of Amenities from Hostaway] → \n', error);
      return [];
    }
  }
}

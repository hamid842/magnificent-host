import { TAmenity, TBedType, TListing, TPropertyType } from "./APITypes";
import HostawayAPI from "./HostawayAPI";
import { saveAPIListing, saveAPIAmenity, saveAPIPropertyType, saveAPIBedType } from "./APIToDB";

//========================================================================================================================

/**
 * Get all listings from Hostaway API and insert them into the database
 */
export const downloadListings = async () => {
  console.log('Retrieve all listings: ');
  const listings: TListing[] = await HostawayAPI.getListings();
  for (const listing of listings) {
    const entry = await saveAPIListing(listing, true);
    console.log(`Saved Listing: ${entry.id}`);
  }
};

//========================================================================================================================

/**
 * Get all PropertyTypes from Hostaway API and insert them into the database
 */
export const downloadPropertyTypes = async () => {
  console.log('Retrieve all PropertyTypes: ');
  const propertyTypes: TPropertyType[] = await HostawayAPI.getPropertyTypes();
  for (const propertyType of propertyTypes) {
    const entry = await saveAPIPropertyType(propertyType, true);
    console.log(`Saved PropertyType: ${entry.id}`);
  }
};

//========================================================================================================================

/**
 * Get all BedTypes from Hostaway API and insert them into the database
 */
export const downloadBedTypes = async () => {
  console.log('Retrieve all BedTypes: ');
  const bedTypes: TBedType[] = await HostawayAPI.getBedTypes();
  for (const bedType of bedTypes) {
    const entry = await saveAPIBedType(bedType, true);
    console.log(`Saved BedType: ${entry.id}`);
  }
};

//========================================================================================================================

/**
 * Get all amenities from Hostaway API and insert them into the database
 */
export const downloadAmenities = async () => {
  console.log('Retrieve all Amenities: ');
  const amenities: TAmenity[] = await HostawayAPI.getAmenities();
  for (const amenity of amenities) {
    const entry = await saveAPIAmenity(amenity, true);
    console.log(`Saved Amenity: ${entry.id}`);
  }
};

//========================================================================================================================

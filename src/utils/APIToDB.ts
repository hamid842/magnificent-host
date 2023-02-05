import { TAmenity, TBedType, TListing, TListingAmenity, TListingBedType, TListingImage, TPropertyType } from "./APITypes";

//========================================================================================================================

/**
* Save the Listing object retrieved from API in the database
*
* @param apiListing The Listing object from API
* @param skipIfExists don't create the entry if its id is present in the database
*/
export const saveAPIListing = async (apiListing: TListing, skipIfExists: boolean = true) => {
  try {
    // If skipIfExists was true, look for the id in the DB, if found -> skip and return the found item
    if (skipIfExists) {
      const entry = await strapi.entityService.findOne('api::property.property', apiListing.id);
      if (entry) return entry;
    }
    //----------------------------------------------------------------------------
    const newEntry = await strapi.entityService.create('api::property.property', {
      data: {
        id: apiListing.id,
        property_type: apiListing.propertyTypeId, // Relationship (PropertyType)
        Title: apiListing.name,
        generalInformation: {}, // X Required
        explanation: apiListing.description,
        address: { // Address Component
          address: apiListing.address,
          country: apiListing.country,
          state: apiListing.state,
          city: apiListing.city,
          zipcode: apiListing.zipcode
        },
        geolocation: { // Geolocation Component
          latitude: apiListing.lat,
          longitude: apiListing.lng
        },
        // Using array.map generate an array of image components
        images: apiListing.listingImages.map((item: TListingImage) => {
          return {
            id: item.id,
            caption: item.caption,
            url: `${item.url}-small`,
            url_original: item.url,
            sortOrder: item.sortOrder
          }
        }),
        price: apiListing.price,
        currencyCode: apiListing.currencyCode,
        personCapacity: apiListing.personCapacity,
        minNights: apiListing.minNights,
        maxNights: apiListing.maxNights,
        guestsIncluded: apiListing.guestsIncluded,
        priceForExtraPerson: apiListing.priceForExtraPerson,
        checkInTimeStart: apiListing.checkInTimeStart, // 0-23
        checkInTimeEnd: apiListing.checkInTimeEnd, // 0-23
        checkOutTime: apiListing.checkOutTime, // 0-23
        squareMeters: apiListing.squareMeters,
        roomType: apiListing.roomType, // Can be enum [entire_home, private_room, shared_room]
        bathroomType: apiListing.bathroomType, // Can be enum [private, shared]
        bedroomsNumber: apiListing.bedroomsNumber,
        bedsNumber: apiListing.bedsNumber,
        bathroomsNumber: apiListing.bathroomsNumber,
        contact: { // Contact Component
          contactName: apiListing.contactName,
          contactSurName: apiListing.contactSurName,
          contactPhone1: apiListing.contactPhone1,
          contactPhone2: apiListing.contactPhone2,
          contactEmail: apiListing.contactEmail,
          contactAddress: apiListing.contactAddress,
        },
        /**
         * Relationship Syntax:
         * categories: {
         *     connect: [
         *      { id: 2 },
         *      { id: 4 }
         *    ],
         * }
         */
        // Relationship (Amenity)
        amenities: {
          connect: apiListing.listingAmenities.map((amen: TListingAmenity) => { return { id: amen.amenityId } })
        },
        // Relationship (BedType)
        bed_types: {
          connect: apiListing.listingBedTypes.map((bt: TListingBedType) => { return { id: bt.bedTypeId } })
        },
        publishedAt: new Date(), // To publish the entry
      },
    });

    return newEntry;
  } catch (error) {
    console.log('[Error while saving listing to DB] → \n', error);
    console.log('[Error Details] → \n', JSON.stringify(error.details, null, 2));
    return null;
  }
};

//========================================================================================================================

/**
* Save the amenity object retrieved from API in the database
*
* @param apiAmenity The amenity object from API
* @param skipIfExists don't create the entry if its id is present in the database
*/
export const saveAPIAmenity = async (apiAmenity: TAmenity, skipIfExists: boolean = true) => {
  try {
    // If skipIfExists was true, look for the id in the DB, if found -> skip and return the found item
    if (skipIfExists) {
      const entry = await strapi.entityService.findOne('api::amenity.amenity', apiAmenity.id);
      if (entry) return entry;
    }
    //----------------------------------------------------------------------------
    const newEntry = await strapi.entityService.create('api::amenity.amenity', {
      data: {
        id: apiAmenity.id,
        name: apiAmenity.name,
        publishedAt: new Date(), // To publish the entry
      },
    });

    return newEntry;
  } catch (error) {
    console.log('[Error while saving amenity to DB] → \n', error);
    return null;
  }
};

//========================================================================================================================

/**
* Save the bedtype object retrieved from API in the database
*
* @param apiBedType The bedtype object from API
* @param skipIfExists don't create the entry if its id is present in the database
*/
export const saveAPIBedType = async (apiBedType: TBedType, skipIfExists: boolean = true) => {
  try {
    // If skipIfExists was true, look for the id in the DB, if found -> skip and return the found item
    if (skipIfExists) {
      const entry = await strapi.entityService.findOne('api::bed-type.bed-type', apiBedType.id);
      if (entry) return entry;
    }
    //----------------------------------------------------------------------------
    const newEntry = await strapi.entityService.create('api::bed-type.bed-type', {
      data: {
        id: apiBedType.id,
        name: apiBedType.name,
        publishedAt: new Date(), // To publish the entry
      },
    });

    return newEntry;
  } catch (error) {
    console.log('[Error while saving bedtype to DB] → \n', error);
    return null;
  }
};

//========================================================================================================================

/**
* Save the PropertyType object retrieved from API in the database
*
* @param apiPropertyType The PropertyType object from API
* @param skipIfExists don't create the entry if its id is present in the database
*/
export const saveAPIPropertyType = async (apiPropertyType: TPropertyType, skipIfExists: boolean = true) => {
  try {
    // If skipIfExists was true, look for the id in the DB, if found -> skip and return the found item
    if (skipIfExists) {
      const entry = await strapi.entityService.findOne('api::property-type.property-type', apiPropertyType.id);
      if (entry) return entry;
    }
    //----------------------------------------------------------------------------
    const newEntry = await strapi.entityService.create('api::property-type.property-type', {
      data: {
        id: apiPropertyType.id,
        name: apiPropertyType.name,
        publishedAt: new Date(), // To publish the entry
      },
    });

    return newEntry;
  } catch (error) {
    console.log('[Error while saving PropertyType to DB] → \n', error);
    return null;
  }
};

//========================================================================================================================

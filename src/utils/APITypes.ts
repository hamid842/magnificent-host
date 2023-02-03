export type TListing = {
  // Some fields which is marked by asterisk (*) are required to change listing status to complete.
  //-----------------------------
  // Required Fields
  //-----------------------------
  id: number, //
  name: string, //
  externalListingName: string, // 	The same as name.
  currencyCode: string, // - *
  address: string, // - *
  price: number, // float - *
  guestsIncluded: number, // - *
  priceForExtraPerson: number, // float - *
  //-----------------------------
  // Optional Fields
  //-----------------------------
  propertyTypeId?: number, // Identifier of propertyType object.
  internalListingName?: string,
  description?: string,
  thumbnailUrl?: string,
  houseRules?: string,
  keyPickup?: string,
  specialInstruction?: string,
  doorSecurityCode?: string,
  country?: string,
  countryCode?: string, // country code values are ISO 3166-2 standard
  state?: string,
  city?: string,
  street?: string,
  publicAddress?: string,
  zipcode?: string,
  starRating?: number,
  weeklyDiscount?: number, // float
  monthlyDiscount?: number, // float
  propertyRentTax?: number, // float
  guestPerPersonPerNightTax?: number, // float
  guestStayTax?: number, // float
  guestNightlyTax?: number, // float
  refundableDamageDeposit?: number, // float
  personCapacity?: number,
  maxChildrenAllowed?: number,
  maxInfantsAllowed?: number,
  maxPetsAllowed?: number,
  lat?: number, // float - Latitude.
  lng?: number, // float - Longitude.
  checkInTimeStart?: number, // Accepted values are 0-23
  checkInTimeEnd?: number, // Accepted values are 0-23
  checkOutTime?: number, // Accepted values are 0-23
  cancellationPolicy?: string, // One of: flexible, moderate, strict.
  cancellationPolicyId?: number, // The policy that applies to OTA bookings. For cancellation policies that apply in direct channels please use the Cancellation policies endpoint
  airBnbCancellationPolicyId?: number, // The policy that applies to Airbnb bookings. Airbnb cancellation policies
  bookingCancellationPolicyId?: number, // The policy that applies to Booking.com bookings. Booking.com cancellation policies
  marriottCancellationPolicyId?: number, // The policy that applies to Marriott bookings. Marriott cancellation policies
  vrboCancellationPolicyId?: number, // The policy that applies to VRBO bookings. Vrbo cancellation policies
  squareMeters?: number,
  roomType?: string, // One of: entire_home, private_room, shared_room.
  bathroomType?: string, // One of: private, shared.
  bedroomsNumber?: number,
  bedsNumber?: number,
  bathroomsNumber?: number,
  minNights?: number,
  maxNights?: number,
  cleaningFee?: number, // float
  instantBookable?: boolean | number,
  instantBookableLeadTime?: number,
  airbnbBookingLeadTime?: number,
  airbnbBookingLeadTimeAllowRequestToBook?: number,
  allowSameDayBooking?: number,
  sameDayBookingLeadTime?: number,
  contactName?: string,
  contactSurName?: string,
  contactPhone1?: string,
  contactPhone2?: string,
  contactLanguage?: string,
  contactEmail?: string,
  contactAddress?: string,
  language?: string,
  timeZoneName?: string,
  wifiUsername?: string,
  wifiPassword?: string,
  cleannessStatus?: string,
  cleaningInstruction?: string,
  cleannessStatusUpdatedOn?:	Date | string, // datetime
  homeawayPropertyName?: string,
  homeawayPropertyHeadline?: string,
  homeawayPropertyDescription?: string,
  bookingcomPropertyName?: string,
  bookingcomPropertyDescription?: string,
  invoicingContactName?: string,
  invoicingContactSurName?: string,
  invoicingContactPhone1?: string,
  invoicingContactPhone2?: string,
  invoicingContactEmail?: string,
  invoicingContactAddress?: string,
  invoicingContactCity?: string,
  invoicingContactZipcode?: string,
  invoicingContactCountry?: string,
  propertyLicenseNumber?: string,
  propertyLicenseType?: string,
  propertyLicenseIssueDate?:	Date | string, // (YYYY-MM-DD)
  propertyLicenseExpirationDate?:	Date | string, // (YYYY-MM-DD)
  partnersListingMarkup?: number, // float
  isRentalAgreementActive?: boolean | number,
  listingAgreementText?: string, // Text for Rental Agreement, set null to delete Agreement.
  listingAmenities?: TListingAmenity[], // Array of listingAmenity objects.
  listingBedTypes?: TListingBedType[], // Array of listingBedType objects.
  listingImages?: TListingImage[], // Array of listingImage objects.
  customFieldValues?: { customFieldId: number, value: string }[], // You should create Custom fields at the dashboard beforehand
};

// Property of Listing
export type TListingAmenity = { id: number, amenityId: number };

// Property of Listing
export type TListingBedType = { id: number, bedTypeId: number, quantity: number };

// Property of Listing
export type TListingImage = { id: number, caption?: string, url: string, sortOrder?: number };

//===========================================================================================================

// API + DB Entity
export type TAmenity = { id: number, name: string };

//===========================================================================================================

// API + DB Entity
export type TBedType = { id: number, name: string };

//===========================================================================================================

// API + DB Entity
export type TPropertyType = { id: number, name: string };

//===========================================================================================================

// Property of Calendar
export type TCalendar = {
  //-----------------------------
  // Required Fields
  //-----------------------------
  id: number,
  date: string | Date,
  //-----------------------------
  // Optional Fields
  //-----------------------------
  isAvailable?: boolean | number, // It’s used to block/unblock single unit listings
  isProcessed?: boolean | number, // It’s an internal informational field to show if the calendar was successfully pushed to all connected channels.
  status?: ECalendarDayStatuses | string, // List of acceptable statuses can be found here: https://api.hostaway.com/dictionary/calendarDay
  price?: number,
  minimumStay?: number,
  maximumStay?: number,
  closedOnArrival?: boolean | number,
  closedOnDeparture?: boolean | number,
  note?: string,
  countAvailableUnits?: number, // How many units of this unit type exist (max available, only for multi unit listing)
  availableUnitsToSell?: number, // How many units are left (available) to sell (only for multi unit listing)
  countPendingUnits?: number, // Number of rooms blocked by pending reservations (only for multi unit listing)
  countBlockingReservations?: number, // Deprecated field (will be replaced with countReservedUnits, only for multi unit listing)
  countBlockedUnits?: number, // Number of of units manually blocked (only for multi unit listing)
  desiredUnitsToSell?: number, // This is the field to update to decide how many units for that unit type to be sold
  reservations?: TReservation[],
};

export enum ECalendarDayStatuses {
  AVAILABLE = 'available',
  BLOCKED = 'blocked',
  M_BLOCKED = 'mblocked', //	blocked by aggregate multi-units (deprecated)
  HARD_BLOCKED = 'hardBlock', //	reserved for future usage
  CONFLICTED = 'conflicted', //	deprecated
  RESERVED = 'reserved', //	blocked by reservation
  PENDING = 'pending', //	has pending reservation
  M_RESRVED = 'mreserved',	// blocked by aggregate multi-unit reservation (deprecated)
};

//===========================================================================================================

export type TReservation = {
  //-----------------------------
  // Required Fields
  //-----------------------------
  id: number, // Unique ID of the reservation on Hostaway
  listingMapId: number, // Identifier of listing object.
  channelId: number, // Value can be set to one of the following: 2000 for a direct reservation, 2020 for a Partner reservation
  arrivalDate: Date | string,
  departureDate: Date | string,
  channelName: string, // Channel name (Airbnb, Booking.com, Expedia, Vrbo etc.)
  reservationId: string, // Reservation ID value which gets from the channel (Airbnb, Booking.com, Expedia, Vrbo etc.)
  hostawayReservationId: number, // Unique ID of the reservation on Hostaway (the same value as ID)
  channelReservationId: string, // The same value as reservationId
  //-----------------------------
  // Optional Fields
  //-----------------------------
  source?: string,
  externalPropertyId?: string,
  externalRatePlanId?: string,
  externalUnitId?: string,
  assigneeUserId?: number,
  manualIcalId?: string,
  manualIcalName?: string,
  isProcessed?: boolean | number,
  isManuallyChecked?: boolean | number,
  isInstantBooked?: boolean | number,
  hasPullError?: boolean | number,
  reservationDate?: Date | string,
  pendingExpireDate?: Date | string,
  guestName?: string,
  guestFirstName?: string, // Guest first name
  guestLastName?: string, // Guest last name
  guestExternalAccountId?: string, //
  guestZipCode?: string, // Guest ZIP code
  guestAddress?: string, // Guest address
  guestCity?: string, // Guest city
  guestCountry?: string, // Guest country
  guestEmail?: string, // Guest email
  guestPicture?: string, // Guest picture
  guestRecommendations?: number,
  guestTrips?: number,
  guestWork?: string,
  isGuestIdentityVerified?: boolean | number,
  isGuestVerifiedByEmail?: boolean | number,
  isGuestVerifiedByWorkEmail?: boolean | number,
  isGuestVerifiedByFacebook?: boolean | number,
  isGuestVerifiedByGovernmentId?: boolean | number,
  isGuestVerifiedByPhone?: boolean | number,
  isGuestVerifiedByReviews?: boolean | number,
  numberOfGuests?: number,
  adults?: number,
  children?: number,
  infants?: number,
  pets?: number,
  isDatesUnspecified?: number, // Set to 1 in case a channel doesn’t provide reservation dates. If it is 1 arrivalDate and departureDate are set to yesterday.
  previousArrivalDate?: Date | string,
  previousDepartureDate?: Date | string,
  checkInTime?: number,
  checkOutTime?: number,
  nights?: number,
  phone?: string,
  totalPrice?: number, // float
  taxAmount?: number, // float
  channelCommissionAmount?: number, // float
  hostawayCommissionAmount?: number, // float
  cleaningFee?: number, // float
  securityDepositFee?: number, // float
  isPaid?: boolean | number,
  paymentMethod?: string,
  stripeGuestId?: string,
  currency?: string,
  status?: string, // Can be one of the following: new, modified, cancelled, ownerStay, pending, awaitingPayment, declined, expired, inquiry, inquiryPreapproved, inquiryDenied, inquiryTimedout, inquiryNotPossible
  cancellationDate?: Date | string,
  cancelledBy?: string, // Can be one of the following: guest, host
  hostNote?: string,
  guestNote?: string,
  guestLocale?: string,
  doorCode?: string,
  doorCodeVendor?: string,
  doorCodeInstruction?: string,
  comment?: string,
  confirmationCode?: string, // Airbnb confirmation code
  airbnbExpectedPayoutAmount?: number, // float
  airbnbListingBasePrice?: number, // float
  airbnbListingCancellationHostFee?: number, // float
  airbnbListingCancellationPayout?: number, // float
  airbnbListingCleaningFee?: number, // float
  airbnbListingHostFee?: number, // float
  airbnbListingSecurityPrice?: number, // float
  airbnbOccupancyTaxAmountPaidToHost?: number, // float
  airbnbTotalPaidAmount?: number, // float
  airbnbTransientOccupancyTaxPaidAmount?: number, // float
  airbnbCancellationPolicy?: string,
  isStarred?: boolean | number,
  isArchived?: boolean | number,
  isPinned?: boolean | number,
  guestAuthHash?: string,
  guestPortalUrl?: string,
  originalChannel?: string,
  latestActivityOn?: Date | string,
  customerUserId?: string,
  reservationAgreement?: string, // Can be one of the following: not_required, signed, not_signed
  rentalAgreementFileUrl?: string, // Link to pdf file with signed Rental Agreement
  customFieldValues?:	{ customFieldId: number, value: string }[], // You should create Custom fields at the dashboard beforehand
  // reservationFees?:	array, // Array of reservationFee objects (will be empty array if includeResources parameter is set to 0).
  // reservationUnit?:	array, // Array of reservationUnit objects (will be empty array if includeResources parameter is set to 0 or reservation is not multi unit).
};

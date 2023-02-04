/**
 * NOTES:
 *    -boolean type should be considered as integer 0 or 1 value
 *    -all time values should be specified in UTC timezone (except for 'checkInTimeStart', 'checkInTimeEnd' and 'checkOutTime' fields of Listing object, which have to be specified in listing’s local timezone)
 *    -all country code values are ISO 3166-2 standard
 */

//===========================================================================================================

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
  checkInTimeStart?: number, // Accepted values are 0-23 |  *have to be specified in listing’s local timezone
  checkInTimeEnd?: number, // Accepted values are 0-23 |  *have to be specified in listing’s local timezone
  checkOutTime?: number, // Accepted values are 0-23 |  *have to be specified in listing’s local timezone
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
  cleannessStatusUpdatedOn?:	string, // datetime
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
  propertyLicenseIssueDate?:	string, // Date - (YYYY-MM-DD)
  propertyLicenseExpirationDate?:	string, // Date - (YYYY-MM-DD)
  partnersListingMarkup?: number, // float
  isRentalAgreementActive?: boolean | number,
  listingAgreementText?: string, // Text for Rental Agreement, set null to delete Agreement.
  listingAmenities?: TListingAmenity[], // Array of listingAmenity objects.
  listingBedTypes?: TListingBedType[], // Array of listingBedType objects.
  listingImages?: TListingImage[], // Array of listingImage objects.
  customFieldValues?: { customFieldId: number, value: string }[], // You should create Custom fields at the dashboard beforehand
};

//===========================================================================================================

// Property of Listing
export type TListingAmenity = { id: number, amenityId: number };

//===========================================================================================================

// Property of Listing
export type TListingBedType = { id: number, bedTypeId: number, quantity: number };

//===========================================================================================================

// Property of Listing
export type TListingImage = { id: number, caption?: string, url: string, sortOrder?: number };

//===========================================================================================================
//===========================================================================================================

// API + DB Entity
export type TAmenity = { id: number, name: string };

//===========================================================================================================
//===========================================================================================================

// API + DB Entity
export type TBedType = { id: number, name: string };

//===========================================================================================================
//===========================================================================================================

// API + DB Entity
export type TPropertyType = { id: number, name: string };

//===========================================================================================================
//===========================================================================================================

// Property of Calendar
export type TCalendar = {
  //-----------------------------
  // Required Fields
  //-----------------------------
  id: number,
  date: string, // Date - (YYYY-MM-DD)
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

//===========================================================================================================

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
//===========================================================================================================

export type TReservation = {
  //-----------------------------
  // Required Fields
  //-----------------------------
  id: number, // Unique ID of the reservation on Hostaway
  listingMapId: number, // Identifier of listing object.
  channelId: number | EChannelId, // Value can be set to one of the following: 2000 for a direct reservation, 2020 for a Partner reservation
  arrivalDate: string, // Date - (YYYY-MM-DD)
  departureDate: string, // Date - (YYYY-MM-DD)
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
  reservationDate?: string, // Date - (YYYY-MM-DD)
  pendingExpireDate?: string, // Date - (YYYY-MM-DD)
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
  previousArrivalDate?: string, // Date - (YYYY-MM-DD)
  previousDepartureDate?: string, // Date - (YYYY-MM-DD)
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
  status?: string | EReservationStatuses, // Can be one of the following: new, modified, cancelled, ownerStay, pending, awaitingPayment, declined, expired, inquiry, inquiryPreapproved, inquiryDenied, inquiryTimedout, inquiryNotPossible
  cancellationDate?: string, // Date - (YYYY-MM-DD)
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
  latestActivityOn?: string, // Date - (YYYY-MM-DD)
  customerUserId?: string,
  reservationAgreement?: string, // Can be one of the following: not_required, signed, not_signed
  rentalAgreementFileUrl?: string, // Link to pdf file with signed Rental Agreement
  customFieldValues?:	{ customFieldId: number, value: string }[], // You should create Custom fields at the dashboard beforehand
  reservationFees?:	TReservationFee[], // Array of reservationFee objects (will be empty array if includeResources parameter is set to 0).
  reservationUnit?:	TReservationUnit[], // Array of reservationUnit objects (will be empty array if includeResources parameter is set to 0 or reservation is not multi unit).
};

//===========================================================================================================

export enum EChannelId {
  DIRECT_RESERVATION = 2000,
  PARTNER_RESERVATION = 2020,
};

//===========================================================================================================

export enum EReservationStatuses {
  NEW = 'new', // New reservation, blocks calendar
  MODIFIED = 'modified', // Reservation that has dates, guests, listing or pricing modified. Blocks calendar
  CANCELLED = 'cancelled', // Reservation cancelled by either host or guest. Does not block calendar
  OWNER_STAY = 'ownerStay', // Hostaway specific status for reservations created by Owners that wish to block their properties usually because they plan to stay in them
  PENDING = 'pending', // Airbnb only: for those clients using Airbnb’s Request to Book functionality. Client needs to approve or decline the reservation. If approved, the status will change to new. If declined, the status wil be expired
  AWAITING_PAYMENT = 'awaitingPayment', // Airbnb only: Intermediary reservation states that require guest action (no host action). If the guest fails to complete their tasks, this would result in status cancelled, otherwise status will be new. This status blocks the calendar
  DECLINED = 'declined', // Airbnb only as a result of declining a Request to Book reservation (pending)
  EXPIRED = 'expired', // As explained in row 5
  UNCONFIRMED = 'unconfirmed', // Vrbo only: similar to pending status for those clients that use Vrbo Request to Book functionality. Client needs to approve or decline the reservation. If approved the status will change to new, if declined it will change to cancelled
  AWAITING_GUEST_VERIFICATION = 'awaitingGuestVerification', // Airbnb only: Intermediary reservation states that require guest action (no host action). If the guest fails to complete their tasks, this would result in status cancelled, otherwise status will be new. This status blocks the calendar
  INQUIRY = 'inquiry', // Reservation status representing a guest question which doesn’t block the calendar
  INQUIRY_PREAPPROVED = 'inquiryPreapproved', // Airbnb only: Hosts can preapprove the guest to encourage reservation. The host will have 24 hours to confirm their reservation. If they don’t the reservation will show status inquiryTimeout. The host can also decline the inquriy and the reservation will have status inquiryNotPossible.
  INQUIRY_DENIED = 'inquiryDenied', // Airbnb only: If a host does not preapprove a guest they will receive a simple inquiry. Hosts will still have 24 to approve or deny de inquiry. If approved it will become a new reservation. If declined it will show status inquiryDenied
  INQUIRY_TIMEOUT = 'inquiryTimedout', // as explained in row 13
  INQUIRY_NOT_POSSIBLE = 'inquiryNotPossible', // as explained in row 13
  UNKNOWN = 'unknown', // Airbnb only: something made the inquiry fail.
};

//===========================================================================================================

// Property of Reservation
export type TReservationFee = {
  //-----------------------------
  // Required Fields
  //-----------------------------
  accountId:number, // int - ID of related Account
  listingMapId:number, // int - ID of related ListingMap
  reservationId:number, // int - ID of related Reservation
  name: string, //  	Fee name, different set of fee names is used for each channel
  insertedOn: string, // datetime - Date and time when fee was inserted
  updatedOn: string, // datetime - Date and time when fee was updated
  //-----------------------------
  // Optional Fields
  //-----------------------------
  amount?: number, // decimal - Fee amount
  currency?: string, // Currency code
  percentage?:number, // int - Fee percentage (0-100) from reservation total amount
  isIncluded?:number, // int - 1 - amount already included to reservation total amount, 0 - not included
  isPerNight?:number, // int - 1 - amount is applied per-night, 0 - per reservation
  isPerPerson?:number, // int - 1 - amount is applied for each guests, 0 - for all guests
  isImported?:number, // int - 1 - reservation fee was created during initial reservations import, 0 - was created by channel
};

//===========================================================================================================

// Property of Reservation
/**
 * This object needs only for multi unit reservation. There can be several reservationUnit objects in one reservation.
 */
export type TReservationUnit = {
  //-----------------------------
  // Required Fields
  //-----------------------------
  reservationId: number, // int - ID of related Reservation
  listingUnitId: number, // int - ID of related ListingUnit
  guestName: string, // Guest name
  numberOfGuests: number, // int - Number of guests
  adults: number, // int - Number of adults
  children: number, // int - Number of children
  infants: number, // int - Number of infants
  totalPrice: number, // float - Total price of this reservation unit
  //-----------------------------
  // Optional Fields
  //-----------------------------
  externalReservationId?: string, // External reservation ID
  externalReservationUnitId?:string, // External reservation unit ID
  guestFirstName?: string, // Guest first name
  guestLastName?: string, // Guest last name
  pets?: number, // int - Number of pets
};

//===========================================================================================================
//===========================================================================================================

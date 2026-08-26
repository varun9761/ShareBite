const crypto = require('node:crypto');

const now = Date.now();

const users = [
  {
    id: 'user-donor-1',
    name: 'Green Bowl Kitchen',
    email: 'donor@sharebite.test',
    role: 'donor',
    verified: true,
    address: 'Koramangala, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.6245 },
  },
  {
    id: 'user-donor-2',
    name: 'Sunrise Caterers',
    email: 'sunrise@sharebite.test',
    role: 'donor',
    verified: false,
    address: 'Indiranagar, Bengaluru',
    coordinates: { lat: 12.9719, lng: 77.6412 },
  },
  {
    id: 'user-ngo-1',
    name: 'Hope Meals Network',
    email: 'ngo@sharebite.test',
    role: 'claimer',
    verified: true,
    address: 'Domlur, Bengaluru',
    coordinates: { lat: 12.9611, lng: 77.6387 },
  },
];

const listings = [
  {
    id: 'listing-1',
    donorId: 'user-donor-1',
    donorName: 'Green Bowl Kitchen',
    foodType: 'Vegetarian meals',
    foodCategory: 'veg',
    quantity: 42,
    quantityUnit: 'servings',
    preparedAt: new Date(now - 45 * 60 * 1000).toISOString(),
    expiresAt: new Date(now + 2.5 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    address: 'Koramangala 5th Block',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    createdAt: new Date(now - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'listing-2',
    donorId: 'user-donor-1',
    donorName: 'Green Bowl Kitchen',
    foodType: 'Bakery boxes',
    foodCategory: 'veg',
    quantity: 18,
    quantityUnit: 'kg',
    preparedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now + 70 * 60 * 1000).toISOString(),
    status: 'claimed',
    claimedBy: 'Hope Meals Network',
    otp: '582914',
    address: 'Koramangala 5th Block',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    createdAt: new Date(now - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'listing-3',
    donorId: 'user-donor-2',
    donorName: 'Sunrise Caterers',
    foodType: 'Rice and curry',
    foodCategory: 'non-veg',
    quantity: 28,
    quantityUnit: 'servings',
    preparedAt: new Date(now - 25 * 60 * 1000).toISOString(),
    expiresAt: new Date(now + 4 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    address: 'Indiranagar 100 Feet Road',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    createdAt: new Date(now - 20 * 60 * 1000).toISOString(),
  },
];

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function listActiveListings() {
  return listings.filter((listing) => ['pending', 'claimed'].includes(listing.status));
}

function createListing(payload, donor = users[0]) {
  const lat = Number(payload.lat);
  const lng = Number(payload.lng);
  const coordinates = Number.isFinite(lat) && Number.isFinite(lng)
    ? { lat, lng }
    : payload.coordinates || donor.coordinates;

  const listing = {
    id: createId('listing'),
    donorId: donor.id,
    donorName: payload.donorName || donor.name,
    donorPhone: payload.donorPhone || '',
    foodType: payload.foodType,
    foodCategory: payload.foodCategory || 'veg',
    quantity: Number(payload.quantity),
    quantityUnit: payload.quantityUnit || 'servings',
    preparedAt: new Date(payload.preparedAt).toISOString(),
    expiresAt: new Date(payload.expiresAt).toISOString(),
    status: 'pending',
    address: payload.address || donor.address,
    coordinates,
    createdAt: new Date().toISOString(),
  };

  listings.unshift(listing);
  return listing;
}

function claimListing(id, claimer = users[2]) {
  const listing = listings.find((item) => item.id === id);
  if (!listing) return null;
  if (listing.status !== 'pending') {
    const error = new Error('Listing is no longer available.');
    error.status = 409;
    throw error;
  }

  listing.status = 'claimed';
  listing.claimedBy = claimer.name;
  listing.claimedById = claimer.id;
  listing.otp = crypto.randomInt(100000, 999999).toString();
  listing.claimedAt = new Date().toISOString();
  return listing;
}

function verifyPickup(id, otp) {
  const listing = listings.find((item) => item.id === id);
  if (!listing) return null;
  if (listing.status !== 'claimed' || listing.otp !== otp) {
    const error = new Error('OTP does not match this claimed pickup.');
    error.status = 400;
    throw error;
  }

  listing.status = 'picked_up';
  listing.pickedUpAt = new Date().toISOString();
  return listing;
}

function expireUnsafeListings(referenceDate = new Date()) {
  const expired = [];
  listings.forEach((listing) => {
    if (['pending', 'claimed'].includes(listing.status) && new Date(listing.expiresAt) <= referenceDate) {
      listing.status = 'expired';
      listing.expiredAt = referenceDate.toISOString();
      expired.push(listing);
    }
  });
  return expired;
}

function verifyUser(id) {
  const user = users.find((item) => item.id === id);
  if (!user) return null;
  user.verified = true;
  return user;
}

function getMetrics() {
  const rescued = listings.filter((listing) => listing.status === 'picked_up');
  const live = listings.filter((listing) => ['pending', 'claimed'].includes(listing.status));

  return {
    totalMealsSaved: rescued.reduce((sum, listing) => {
      return sum + (listing.quantityUnit === 'servings' ? listing.quantity : listing.quantity * 3);
    }, 1260),
    kgRescued: rescued.reduce((sum, listing) => {
      return sum + (listing.quantityUnit === 'kg' ? listing.quantity : Math.round(listing.quantity * 0.35));
    }, 384),
    activeListings: live.length,
    verifiedPartners: users.filter((user) => user.verified).length,
  };
}

module.exports = {
  users,
  listings,
  listActiveListings,
  createListing,
  claimListing,
  verifyPickup,
  expireUnsafeListings,
  verifyUser,
  getMetrics,
};

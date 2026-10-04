import { useState } from 'react'
import { X, Building2, MapPin, LocateFixed, Clock, Utensils, Sparkles, Check } from 'lucide-react'
import { toDatetimeLocal } from '../../api/client'
import { CategoryToggle } from '../ui/Badges'

export function FoodModal({ userLocation, nearbyRestaurants = [], onClose, onSubmit, onTrackGPS, locating }) {
  const [useExistingRestaurant, setUseExistingRestaurant] = useState(false)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('')

  const [donorName, setDonorName] = useState('Green Bowl Kitchen')
  const [donorPhone, setDonorPhone] = useState('+91 98450 12345')
  const [foodType, setFoodType] = useState('')
  const [foodCategory, setFoodCategory] = useState('veg')
  const [quantity, setQuantity] = useState('30')
  const [quantityUnit, setQuantityUnit] = useState('servings')

  const now = new Date()
  const defaultExpiry = new Date(now.getTime() + 3 * 60 * 60 * 1000)

  const [preparedAt, setPreparedAt] = useState(toDatetimeLocal(now))
  const [expiresAt, setExpiresAt] = useState(toDatetimeLocal(defaultExpiry))
  const [address, setAddress] = useState(userLocation.address || '')
  const [coords, setCoords] = useState({ lat: userLocation.lat, lng: userLocation.lng })

  function handleSelectRestaurant(id) {
    setSelectedRestaurantId(id)
    const found = nearbyRestaurants.find((r) => r.id === id)
    if (found) {
      setDonorName(found.name)
      setAddress(found.address)
      setDonorPhone(found.phone || '+91 98450 00123')
      setCoords(found.coordinates)
    }
  }

  function handleApplyLiveLocation() {
    setAddress(userLocation.address)
    setCoords({ lat: userLocation.lat, lng: userLocation.lng })
  }

  function handleQuickExpiry(hours) {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000)
    setExpiresAt(toDatetimeLocal(d))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!foodType.trim() || !quantity || !expiresAt) {
      alert('Please provide food description, quantity, and safe expiry window.')
      return
    }

    onSubmit({
      donorName: donorName.trim() || 'Community Donor',
      donorPhone: donorPhone.trim(),
      foodType: foodType.trim(),
      foodCategory,
      quantity: Number(quantity),
      quantityUnit,
      preparedAt,
      expiresAt,
      address: address.trim() || 'Address registered on pickup',
      coordinates: coords,
      lat: coords.lat,
      lng: coords.lng,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-[#131926] my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles size={12} /> Food Recovery Portal
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Post Surplus Food Batch</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* STEP 1: Restaurant Identity */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                1. Restaurant / Food Business
              </span>
              <div className="flex gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setUseExistingRestaurant(false)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    !useExistingRestaurant
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                  }`}
                >
                  Type Name
                </button>
                {nearbyRestaurants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseExistingRestaurant(true)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      useExistingRestaurant
                        ? 'bg-emerald-700 text-white'
                        : 'text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                    }`}
                  >
                    Select Nearby Venue
                  </button>
                )}
              </div>
            </div>

            {useExistingRestaurant ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pick from Verified Venues in your area:
                </label>
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => handleSelectRestaurant(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                >
                  <option value="">-- Choose a local restaurant / bakery --</option>
                  {nearbyRestaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.type} · {r.address.slice(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Restaurant / Caterer Name:
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Mario's Pizzeria & Cafe"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone (For NGO pickup):
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Food Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                2. Food Description & Dietary Type:
              </label>
              <input
                type="text"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                placeholder="e.g. 45 Vegetarian Lunch Platters (Rice, Dal, Paneer Gravy)"
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <CategoryToggle
                active={foodCategory === 'veg'}
                name="modalCategory"
                value="veg"
                label="Pure Vegetarian"
                onChange={() => setFoodCategory('veg')}
              />
              <CategoryToggle
                active={foodCategory === 'non-veg'}
                name="modalCategory"
                value="non-veg"
                label="Contains Non-Veg"
                onChange={() => setFoodCategory('non-veg')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity:
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unit:
                </label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                >
                  <option value="servings">Portions / Servings</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="boxes">Food Boxes</option>
                  <option value="loaves">Loaves / Breads</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: Safe Expiry Window */}
          <div className="space-y-2 rounded-2xl bg-slate-50 p-3.5 dark:bg-[#0E1420]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                3. Safe Expiry Window (Food must be collected before):
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickExpiry(2)}
                  className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                >
                  +2h
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickExpiry(4)}
                  className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                >
                  +4h
                </button>
              </div>
            </div>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#131926] dark:text-white"
            />
          </div>

          {/* STEP 4: Pickup Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                4. Pickup Address & Coordinates:
              </label>
              <button
                type="button"
                onClick={handleApplyLiveLocation}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                <LocateFixed size={12} /> Auto-fill My Detected Location
              </button>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
              required
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
          >
            <Check size={18} />
            Publish Surplus Food (Live on Map)
          </button>
        </form>
      </div>
    </div>
  )
}

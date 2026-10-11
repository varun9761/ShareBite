import { useState } from 'react'
import { X, Building2, MapPin, LocateFixed, Clock, Utensils, Sparkles, Check, Loader2, Leaf, Beef } from 'lucide-react'
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
  const [submitting, setSubmitting] = useState(false)

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    if (!foodType.trim() || !quantity || !expiresAt) {
      alert('Please provide food description, quantity, and safe expiry window.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
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
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xl dark:border-slate-800 dark:bg-[#131926] my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Sparkles size={14} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                Post Surplus Food Batch
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Live OpenStreetMap Broadcast
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 w-full min-w-0">
          {/* STEP 1: Venue & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1 min-w-0">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Restaurant / Venue:
                </label>
                {nearbyRestaurants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseExistingRestaurant(!useExistingRestaurant)}
                    className="text-[10px] font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {useExistingRestaurant ? 'Type name' : 'Pick nearby'}
                  </button>
                )}
              </div>
              {useExistingRestaurant ? (
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => handleSelectRestaurant(e.target.value)}
                  className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                >
                  <option value="">-- Choose local venue --</option>
                  {nearbyRestaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name.slice(0, 24)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Green Bowl Kitchen"
                  required
                  className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                />
              )}
            </div>

            <div className="min-w-0">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone:
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
              />
            </div>
          </div>

          {/* STEP 2: Food Description */}
          <div className="w-full min-w-0">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Food Description &amp; Dishes:
            </label>
            <input
              type="text"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              placeholder="e.g. 35 Portions Veg Meals (Rice, Dal, Subzi)"
              required
              className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            />
          </div>

          {/* STEP 3: Category Toggle with Bold Red Non-Veg Accent */}
          <div className="grid grid-cols-2 gap-2 w-full min-w-0">
            <CategoryToggle
              active={foodCategory === 'veg'}
              name="modalCategory"
              value="veg"
              icon={<Leaf size={14} className="text-emerald-600 shrink-0" />}
              label="Pure Veg"
              onChange={() => setFoodCategory('veg')}
            />
            <CategoryToggle
              active={foodCategory === 'non-veg'}
              name="modalCategory"
              value="non-veg"
              icon={<Beef size={14} className="text-rose-600 shrink-0" />}
              label="Non-Veg (Red)"
              onChange={() => setFoodCategory('non-veg')}
            />
          </div>

          {/* STEP 4: Quantity & Unit */}
          <div className="grid grid-cols-2 gap-2 w-full min-w-0">
            <div className="min-w-0">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Quantity:
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Unit:
              </label>
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
              >
                <option value="servings">Portions / Servings</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="boxes">Food Boxes</option>
                <option value="loaves">Breads / Packs</option>
              </select>
            </div>
          </div>

          {/* STEP 5: Safe Expiry Window */}
          <div className="w-full min-w-0">
            <div className="flex items-center justify-between mb-1 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Safe Expiry (Must pickup before):
              </label>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleQuickExpiry(2)}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  +2h
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickExpiry(4)}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
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
              className="h-9 w-full max-w-full min-w-0 box-border block rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            />
          </div>

          {/* STEP 6: Pickup Address with Instant GPS Auto-fill */}
          <div className="w-full min-w-0">
            <div className="flex items-center justify-between mb-1 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Pickup Address:
              </label>
              <button
                type="button"
                onClick={handleApplyLiveLocation}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline dark:text-emerald-400 shrink-0"
              >
                <LocateFixed size={11} /> Auto-fill GPS
              </button>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
              required
              className="h-9 w-full max-w-full min-w-0 box-border rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            />
          </div>

          {/* Submit Button with Loading Spinner and Double-Click Guard */}
          <button
            type="submit"
            disabled={submitting}
            className={`mt-2.5 flex h-10 sm:h-11 w-full max-w-full min-w-0 box-border items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black text-white shadow-md transition ${
              submitting
                ? 'bg-emerald-700/80 cursor-not-allowed opacity-80'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-emerald-600/30'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publishing Surplus Food...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Publish Surplus Food (Live on Map)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

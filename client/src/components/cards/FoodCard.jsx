import {
  Building2,
  Clock,
  Flame,
  HandHeart,
  Leaf,
  Beef,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Utensils,
} from 'lucide-react'
import { generateWhatsAppShareUrl, getGoogleMapsDirectionsUrl, calculateDistanceKm } from '../../api/client'
import { FoodTypeBadge, StatusBadge, CardStat } from '../ui/Badges'
import { Countdown } from '../ui/Countdown'
import { RescueStepper } from '../ui/RescueStepper'
import { FreshnessMeter } from '../ui/FreshnessMeter'

export function FoodCard({ listing, onClaim, donorMode = false, onVerifyOTP, onSelectRoute, userLocation }) {
  const isVeg = listing.foodCategory !== 'non-veg'
  const isUrgent = listing.urgency === 'critical' || listing.urgency === 'urgent'

  const destLat = listing.coordinates?.lat ?? listing.lat
  const destLng = listing.coordinates?.lng ?? listing.lng
  const liveDistance = (userLocation?.lat && userLocation?.lng && destLat && destLng)
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, destLat, destLng)
    : (listing.distanceKm || 0)
  const transitMins = Math.max(3, Math.round(liveDistance * 2.5))

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isVeg
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {isVeg ? <Leaf size={24} /> : <Beef size={24} />}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-black text-slate-900 dark:text-white">
                {listing.foodType}
              </h2>
              <FoodTypeBadge category={listing.foodCategory} />
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                <Building2 size={13} className="text-emerald-600" />
                {listing.donorName}
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin size={13} />
                {listing.address}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-amber-500 to-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm animate-pulse">
              <Flame size={11} /> Urgent
            </span>
          )}
          <StatusBadge status={listing.status} />
        </div>
      </div>

      {/* Rescue Lifecycle Stepper */}
      <div className="mt-3">
        <RescueStepper status={listing.status} />
      </div>

      {/* Freshness Countdown & Battery Bar */}
      <div className="mt-3 space-y-1 rounded-xl border border-slate-200/90 bg-slate-50 p-2.5 dark:border-slate-750 dark:bg-[#1A2234]">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <Clock size={14} className={isUrgent ? 'animate-pulse text-rose-600' : 'text-emerald-600'} />
            Safe Until Expiry:
          </span>
          <Countdown expiresAt={listing.expiresAt} urgent={isUrgent} />
        </div>
        <FreshnessMeter preparedAt={listing.preparedAt} expiresAt={listing.expiresAt} status={listing.status} />
      </div>

      {/* Stats Grid */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <CardStat label={listing.quantityUnit} value={listing.quantity} icon={<Utensils size={13} className="text-amber-600 dark:text-amber-400" />} />
        <CardStat label="Distance" value={`${liveDistance} km`} icon={<Navigation size={13} className="text-blue-600 dark:text-blue-400" />} />
        <CardStat label="Est. Transit" value={`~${transitMins} min`} icon={<Truck size={13} className="text-emerald-600 dark:text-emerald-400" />} />
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <span className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-400">
          <Leaf size={13} /> Avoids ~{listing.co2AvoidedKg} kg CO₂
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* WhatsApp Volunteer Dispatch */}
          <a
            href={generateWhatsAppShareUrl(listing)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600"
            title="Share to Volunteer WhatsApp Group"
          >
            <MessageCircle size={13} />
            WhatsApp
          </a>

          {/* Turn-by-Turn Directions */}
          <a
            href={getGoogleMapsDirectionsUrl(listing, userLocation)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600"
            title="Turn-by-Turn Driving Directions on Google Maps"
          >
            <Navigation size={13} />
            Directions
          </a>

          {/* Direct Phone Call */}
          {listing.donorPhone && (
            <a
              href={`tel:${listing.donorPhone}`}
              className="inline-flex items-center rounded-xl bg-slate-100 p-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              title={`Call ${listing.donorPhone}`}
            >
              <Phone size={13} />
            </a>
          )}

          {!donorMode && listing.status === 'pending' && (
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-1.5 text-xs font-black text-white shadow-md shadow-orange-500/25 transition hover:brightness-110 active:scale-95"
              onClick={() => onClaim(listing.id)}
            >
              <HandHeart size={14} />
              Claim Batch
            </button>
          )}

          {donorMode && listing.status === 'claimed' && (
            <button
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
              onClick={() => onVerifyOTP(listing)}
            >
              <ShieldCheck size={14} />
              Verify OTP ({listing.otp})
            </button>
          )}

          {donorMode && listing.status === 'picked_up' && (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={15} /> Rescued
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

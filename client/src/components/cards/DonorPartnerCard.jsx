import { Utensils, MapPin, Phone, Globe2, Navigation, CheckCircle2 } from 'lucide-react'
import { calculateDistanceKm } from '../../api/client'

export function DonorPartnerCard({ donor, userLocation, onSelectAsDonor }) {
  const destLat = donor.coordinates?.lat ?? donor.lat
  const destLng = donor.coordinates?.lng ?? donor.lng
  const originParam = userLocation?.lat && userLocation?.lng ? `&origin=${userLocation.lat},${userLocation.lng}` : ''
  const directionsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destLat},${destLng}`

  const liveDistance = (userLocation?.lat && userLocation?.lng && destLat && destLng)
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, destLat, destLng)
    : (donor.distanceKm || 0)

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Utensils size={24} />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-black text-slate-900 dark:text-white">{donor.name}</h3>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 size={11} /> Real Venue
              </span>
            </div>

            <p className="mt-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {donor.cuisine || donor.type || 'Restaurant & Food Kitchen'}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{donor.address}</span>
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
          {liveDistance} km away
        </span>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <span>⭐ Rating: <strong>{donor.rating || '4.8 ★'}</strong></span>
          <span>📦 <strong>{donor.totalDonations || 24}+</strong> rescued batches</span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {donor.phone && (
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300"
            >
              <Phone size={13} />
              Call Venue
            </a>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300"
          >
            <Navigation size={13} />
            Directions
          </a>

          {onSelectAsDonor && (
            <button
              onClick={() => onSelectAsDonor(donor)}
              className="col-span-2 sm:col-auto flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 sm:py-1.5 font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-95"
            >
              Post Food for this Restaurant
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

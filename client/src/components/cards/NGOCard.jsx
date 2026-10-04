import { Building2, HeartHandshake, MapPin, Navigation, Phone, ShieldCheck } from 'lucide-react'

export function NGOCard({ ngo, onConnect }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ngo.coordinates.lat},${ngo.coordinates.lng}`

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Building2 size={24} />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-black text-slate-900 dark:text-white">{ngo.name}</h3>
              {ngo.verified && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">{ngo.cause}</p>

            <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{ngo.address}</span>
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
          {ngo.distanceKm} km away
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <span>👥 Capacity: <strong>~{ngo.capacity || 400} meals/day</strong></span>
          <span>🕒 {ngo.operatingHours || '09:00 - 21:00'}</span>
        </div>

        <div className="flex items-center gap-2">
          {ngo.contactPhone && (
            <a
              href={`tel:${ngo.contactPhone}`}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300"
            >
              <Phone size={13} />
              Call
            </a>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300"
          >
            <Navigation size={13} />
            Directions
          </a>

          <button
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
            onClick={() => onConnect(ngo)}
          >
            <HeartHandshake size={14} />
            Connect / Dispatch
          </button>
        </div>
      </div>
    </article>
  )
}

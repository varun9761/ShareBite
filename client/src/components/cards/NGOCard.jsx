import { Building2, HeartHandshake, MapPin, Navigation, Phone, ShieldCheck } from 'lucide-react'

export function NGOCard({ ngo, onConnect }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ngo.coordinates.lat},${ngo.coordinates.lng}`

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-[#131926]">
      {/* Top Row: Icon + Title + Distance */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Building2 size={20} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {ngo.name}
            </h3>
            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] sm:text-xs font-black text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
              {ngo.distanceKm} km
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
            {ngo.verified && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck size={10} /> Verified
              </span>
            )}
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 truncate">
              {ngo.cause}
            </span>
          </div>

          <p className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{ngo.address}</span>
          </p>
        </div>
      </div>

      {/* Middle Row: Capacity & Operating Hours */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>👥 Capacity: <strong>~{ngo.capacity || 400} meals</strong></span>
          <span>🕒 <strong>{ngo.operatingHours || '09:00 - 21:00'}</strong></span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-2.5 flex items-center gap-2">
        {ngo.contactPhone && (
          <a
            href={`tel:${ngo.contactPhone}`}
            className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-750 dark:bg-[#0E1420] dark:text-slate-300"
          >
            <Phone size={12} />
            <span>Call</span>
          </a>
        )}

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-750 dark:bg-[#0E1420] dark:text-slate-300"
        >
          <Navigation size={12} />
          <span>Directions</span>
        </a>

        <button
          className="flex-[1.5] flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
          onClick={() => onConnect(ngo)}
        >
          <HeartHandshake size={13} />
          <span>Connect</span>
        </button>
      </div>
    </article>
  )
}

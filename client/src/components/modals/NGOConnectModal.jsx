import { X, ShieldCheck, MapPin, Phone, Globe2, Plus } from 'lucide-react'

export function NGOConnectModal({ ngo, onClose, onOpenPostFood }) {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ngo.name}, ${ngo.address}`)}`

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck size={12} /> Verified Food Rescue Partner
            </span>
            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{ngo.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-blue-700 dark:text-blue-400">{ngo.cause}</p>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400" />
            <span>{ngo.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-slate-400" />
            <a href={`tel:${ngo.contactPhone}`} className="font-bold text-emerald-600 hover:underline">
              {ngo.contactPhone}
            </a>
          </div>
          {ngo.website && (
            <div className="flex items-center gap-2">
              <Globe2 size={14} className="text-slate-400" />
              <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                {ngo.website}
              </a>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl border border-slate-200 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:text-slate-300"
          >
            View Directions
          </a>
          <button
            onClick={onOpenPostFood}
            className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition"
          >
            Dispatch Surplus Food
          </button>
        </div>
      </div>
    </div>
  )
}

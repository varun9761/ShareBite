import { useState } from 'react'
import { X, Search, Loader2, MapPin } from 'lucide-react'
import { api } from '../../api/client'

export function LocationSearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const data = await api(`/api/geocode/search?q=${encodeURIComponent(query)}`)
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Search Location or City</h2>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type city, street, or area name..."
            autoFocus
            className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
          />
          <button
            type="submit"
            disabled={searching}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </form>

        <div className="mt-4 max-h-60 overflow-y-auto space-y-1.5">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(item)}
                className="flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition dark:text-slate-300 dark:hover:bg-[#1A2234] dark:hover:text-white"
              >
                <MapPin size={15} className="shrink-0 text-emerald-600 mt-0.5" />
                <span className="line-clamp-2 font-medium">{item.displayName || item.address}</span>
              </button>
            ))
          ) : query && !searching ? (
            <p className="py-4 text-center text-xs text-slate-500">No matching locations found.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

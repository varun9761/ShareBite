import { Leaf, Beef } from 'lucide-react'
import { statusBadgeTone } from '../../api/client'

export function StatusBadge({ status }) {
  const tone = statusBadgeTone[status] || 'bg-slate-100 text-slate-800'
  const label = status ? status.replace('_', ' ') : 'unknown'
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${tone}`}>
      {label}
    </span>
  )
}

export function FoodTypeBadge({ category }) {
  const isVeg = category !== 'non-veg'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
        isVeg
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
      }`}
    >
      {isVeg ? <Leaf size={11} /> : <Beef size={11} />}
      {isVeg ? 'Veg' : 'Non-Veg'}
    </span>
  )
}

export function CardStat({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-2 text-center dark:border-slate-800 dark:bg-[#0E1420]">
      <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400">{icon}</div>
      <div className="mt-1 text-xs font-black capitalize text-slate-900 dark:text-white">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}

export function DiscoveryTabChip({ active, onClick, icon, label, count, color = 'emerald' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
        active
          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 dark:bg-emerald-600 dark:shadow-emerald-600/30'
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-[#131926] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

export function CategoryToggle({ active, name, value, icon, label, onChange }) {
  return (
    <label
      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
        active
          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300'
      }`}
    >
      <input type="radio" name={name} value={value} checked={active} onChange={onChange} className="sr-only" />
      {icon}
      {label}
    </label>
  )
}

export function ToggleButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition ${
        active
          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

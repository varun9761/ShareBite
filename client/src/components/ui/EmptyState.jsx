import { Sparkles } from 'lucide-react'

export function EmptyState({ title, message, actionText, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#131926]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
        <Sparkles size={24} />
      </div>
      <h3 className="mt-3 text-sm font-black text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

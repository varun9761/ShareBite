import { useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

export function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearInterval(timer)
  }, [message, onClose])

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md border border-slate-700 animate-bounce">
      <Sparkles size={16} className="text-amber-400 shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded-lg p-1 text-slate-400 hover:text-white transition"
      >
        <X size={14} />
      </button>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'

export function FreshnessMeter({ preparedAt, expiresAt, status }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (status === 'expired') {
    return (
      <div className="w-full space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-rose-600">
          <span>Freshness Battery</span>
          <span>0% · Expired</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full w-0 rounded-full bg-rose-500" />
        </div>
      </div>
    )
  }

  const expiryTime = new Date(expiresAt).getTime()
  const prepTime = preparedAt ? new Date(preparedAt).getTime() : expiryTime - 4 * 60 * 60 * 1000
  const totalWindow = Math.max(expiryTime - prepTime, 1)
  const remainingMs = Math.max(0, expiryTime - now)
  const pct = Math.min(100, Math.max(0, Math.round((remainingMs / totalWindow) * 100)))

  let barColor = 'bg-emerald-500'
  let textColor = 'text-emerald-700 dark:text-emerald-400'
  let label = 'Optimal Freshness'
  if (pct <= 20 || remainingMs < 60 * 60 * 1000) {
    barColor = 'bg-rose-500 animate-pulse'
    textColor = 'text-rose-600 dark:text-rose-400 font-black'
    label = 'Critical Window (<1 hr)'
  } else if (pct <= 50) {
    barColor = 'bg-amber-500'
    textColor = 'text-amber-600 dark:text-amber-400'
    label = 'Expiring Soon'
  }

  return (
    <div className="mt-2 w-full space-y-1">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Zap size={12} className={pct <= 20 ? 'animate-bounce text-rose-500' : 'text-amber-500'} />
          Freshness Battery: <strong className={textColor}>{label}</strong>
        </span>
        <span className={`font-mono text-xs font-bold ${textColor}`}>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/90 p-0.5 dark:bg-slate-700/80">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

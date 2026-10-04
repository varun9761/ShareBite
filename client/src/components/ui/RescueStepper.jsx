import { Check, AlertTriangle } from 'lucide-react'

export function RescueStepper({ status }) {
  const isExpired = status === 'expired'
  const steps = [
    { key: 'listed', label: '1. Listed' },
    { key: 'claimed', label: '2. Claimed' },
    { key: 'transit', label: '3. In-Transit' },
    { key: 'delivered', label: '4. Rescued' },
  ]

  let currentStepIdx = 0
  if (status === 'claimed') currentStepIdx = 2
  if (status === 'picked_up') currentStepIdx = 4

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
        <AlertTriangle size={14} className="shrink-0 text-rose-600" />
        <span>Rescue Window Closed: Listing passed safe expiry threshold.</span>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border border-slate-100 bg-slate-50/80 p-2 dark:border-slate-800/80 dark:bg-[#0e1422]">
      <div className="flex items-center justify-between text-[11px]">
        {steps.map((step, idx) => {
          const isDone = currentStepIdx > idx
          const isCurrent = currentStepIdx === idx && status !== 'picked_up'
          return (
            <div key={step.key} className="relative flex flex-1 flex-col items-center text-center">
              {idx > 0 && (
                <div
                  className={`absolute -left-1/2 top-2.5 -z-0 h-0.5 w-full transition-colors duration-300 ${
                    idx <= currentStepIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : isCurrent
                    ? 'animate-pulse bg-amber-500 text-white ring-4 ring-amber-500/20'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {isDone ? <Check size={11} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                className={`mt-1 text-[10px] font-bold leading-tight ${
                  isCurrent
                    ? 'text-amber-600 dark:text-amber-400'
                    : isDone
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

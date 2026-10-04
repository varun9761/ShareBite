import { useState } from 'react'
import { X, ShieldCheck, Check } from 'lucide-react'

export function OTPVerifyModal({ listing, onClose, onVerify }) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Please enter the full 6-digit OTP provided by the NGO.')
      return
    }
    onVerify(otp)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          <ShieldCheck size={28} />
        </div>
        <h2 className="mt-3 text-lg font-black text-slate-900 dark:text-white">Verify Food Pickup</h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Enter the 6-digit OTP shown on the NGO volunteer&apos;s phone to finalize pickup of:
        </p>
        <div className="my-2 rounded-xl bg-slate-50 p-2 text-xs font-bold text-slate-800 dark:bg-[#0E1420] dark:text-slate-200">
          {listing.foodType} ({listing.quantity} {listing.quantityUnit})
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''))
              setError('')
            }}
            placeholder="• • • • • •"
            autoFocus
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 text-center font-mono text-3xl font-black tracking-widest text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
          />

          {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

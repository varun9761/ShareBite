import { useState } from 'react'
import { Check, Copy, MessageCircle, Navigation } from 'lucide-react'
import { RescueStepper } from '../ui/RescueStepper'
import { getGoogleMapsDirectionsUrl } from '../../api/client'

export function ClaimSuccessModal({ listing, onClose }) {
  const [copied, setCopied] = useState(false)

  function copyOtp() {
    navigator.clipboard?.writeText?.(listing.otp)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const volunteerMsg =
    `🚨 *VOLUNTEER FOOD PICKUP DISPATCH - ShareBite* 🚨\n\n` +
    `🔑 *PICKUP OTP:* *${listing.otp}*\n` +
    `🍲 *Batch:* ${listing.foodType} (${listing.quantity} ${listing.quantityUnit})\n` +
    `🏢 *Donor:* ${listing.donorName}\n` +
    `📍 *Pickup Address:* ${listing.address}\n` +
    `🗺️ *Map Navigation:* ${getGoogleMapsDirectionsUrl(listing)}\n\n` +
    `⚠️ Please verify this OTP with the donor upon arrival.`

  const volunteerWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(volunteerMsg)}`

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-[#131926]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Check size={32} />
        </div>
        <h2 className="mt-3 text-xl font-black text-slate-900 dark:text-white">Surplus Food Claimed!</h2>
        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          Show this 6-digit OTP to the donor at <strong>{listing.address}</strong> to complete pickup.
        </p>

        {/* Rescue Lifecycle Stepper */}
        <div className="my-3 text-left">
          <RescueStepper status="claimed" />
        </div>

        <div className="my-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 ring-2 ring-emerald-500/30 dark:border-emerald-800 dark:bg-emerald-950/50">
          <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">Your Pickup Verification OTP</span>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-mono text-4xl font-black tracking-widest text-emerald-700 dark:text-emerald-300">{listing.otp}</span>
            <button
              onClick={copyOtp}
              className="rounded-lg bg-emerald-100 p-1.5 text-emerald-800 hover:bg-emerald-200 transition dark:bg-emerald-900 dark:text-emerald-200"
              title="Copy OTP to Clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          {copied && <span className="text-[10px] font-bold text-emerald-700">✓ OTP copied to clipboard!</span>}
        </div>

        <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-left text-xs font-semibold text-slate-700 dark:bg-[#0E1420] dark:text-slate-300">
          <div>🍲 <strong>Batch:</strong> {listing.foodType} ({listing.quantity} {listing.quantityUnit})</div>
          <div>🏢 <strong>Donor:</strong> {listing.donorName}</div>
          <div>📍 <strong>Address:</strong> {listing.address}</div>
        </div>

        {/* Quick Volunteer Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={volunteerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <MessageCircle size={15} />
            Forward on WhatsApp
          </a>

          <a
            href={getGoogleMapsDirectionsUrl(listing)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Navigation size={15} />
            Start Directions
          </a>
        </div>

        <button
          className="mt-3 w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 transition"
          onClick={onClose}
        >
          Done & Return to Dashboard
        </button>
      </div>
    </div>
  )
}

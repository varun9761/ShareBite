import { useState } from 'react'
import {
  Plus,
  Award,
  Utensils,
  ShieldCheck,
  Zap,
  Building2,
  Sparkles,
} from 'lucide-react'
import { FoodCard } from '../cards/FoodCard'
import { InteractiveImpactChart } from '../ui/InteractiveImpactChart'
import { EmptyState } from '../ui/EmptyState'

export function DonorDashboard({
  listings = [],
  metrics,
  userLocation,
  onOpenModal,
  onVerifyOTP,
  onOpenCertificate,
}) {
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'pending' | 'claimed' | 'picked_up'

  const pendingCount = listings.filter((l) => l.status === 'pending').length
  const claimedCount = listings.filter((l) => l.status === 'claimed').length
  const completedCount = listings.filter((l) => l.status === 'picked_up').length

  const filteredListings = listings.filter((l) => {
    if (filterStatus === 'all') return true
    return l.status === filterStatus
  })

  return (
    <div className="space-y-4">
      {/* 3-Step Simplified Guide (Matches Claimer 3-Step Guide) */}
      <section className="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
          <Sparkles size={14} className="text-emerald-600" />
          <span>How Donor Food Rescue Works in 3 Easy Steps</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-[#131926]/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white text-[10px]">
              1
            </span>
            <div>
              <strong className="text-slate-900 dark:text-white">Post for Your Restaurant:</strong>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Click &apos;+ Post Surplus Batch&apos;. Enter portions, food type, Veg/Non-Veg tag, and safe expiry time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-[#131926]/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white text-[10px]">
              2
            </span>
            <div>
              <strong className="text-slate-900 dark:text-white">NGO Claims Your Food:</strong>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                A nearby verified charity claims the batch and receives a secret 6-digit Pickup OTP with GPS directions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-[#131926]/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white text-[10px]">
              3
            </span>
            <div>
              <strong className="text-slate-900 dark:text-white">Verify OTP on Arrival:</strong>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                When their driver arrives, click &apos;Verify OTP&apos;, enter their code, and hand over the food!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donor Action Header */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 shrink-0">
            <Utensils size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Restaurant &amp; Kitchen Operations
              </h1>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Donor Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Turn excess inventory into certified CSR community meals with 100% traceability.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
            onClick={() => onOpenCertificate?.({ name: 'Green Bowl Kitchen', role: 'donor' })}
          >
            <Award size={15} className="text-emerald-600 dark:text-emerald-400" />
            View Impact Certificate
          </button>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
            onClick={onOpenModal}
          >
            <Plus size={16} />
            Post Surplus Batch
          </button>
        </div>
      </section>

      {/* Batch Status Quick Filters */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">Filter:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            All Batches ({listings.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            ⏳ Waiting for NGO ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('claimed')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              filterStatus === 'claimed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            🔑 Ready for Pickup ({claimedCount})
          </button>
          <button
            onClick={() => setFilterStatus('picked_up')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              filterStatus === 'picked_up'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            ✅ Rescued ({completedCount})
          </button>
        </div>

        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
        >
          <Plus size={14} />
          New Batch
        </button>
      </section>

      {/* Interactive Impact & Sustainability Visualizer */}
      <InteractiveImpactChart metrics={metrics} listings={listings} />

      {/* Listings list */}
      <section className="grid gap-4">
        {filteredListings.length === 0 ? (
          <EmptyState
            title="No food batches in this category"
            message="Click '+ Post Surplus Batch' to register excess food from your restaurant or catering kitchen."
            actionText="+ Post Surplus Batch Now"
            onAction={onOpenModal}
          />
        ) : (
          filteredListings.map((listing) => (
            <FoodCard key={listing.id} listing={listing} donorMode userLocation={userLocation} onVerifyOTP={onVerifyOTP} />
          ))
        )}
      </section>
    </div>
  )
}

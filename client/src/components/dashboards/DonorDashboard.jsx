import { useState } from 'react'
import {
  Plus,
  Award,
  Utensils,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react'
import { FoodCard } from '../cards/FoodCard'
import { InteractiveImpactChart } from '../ui/InteractiveImpactChart'
import { EmptyState } from '../ui/EmptyState'

export function DonorDashboard({
  listings = [],
  metrics,
  userLocation,
  currentUser,
  onOpenModal,
  onVerifyOTP,
  onOpenCertificate,
}) {
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'pending' | 'claimed' | 'picked_up'
  const [showMobileChart, setShowMobileChart] = useState(false)

  const nowMs = Date.now()
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000

  // Automatically remove listings that are past 12 hours of their expiry time
  const activeAndRecentListings = listings.filter((l) => {
    if (l.status === 'expired' || (l.expiresAt && new Date(l.expiresAt).getTime() < nowMs)) {
      const expTime = new Date(l.expiresAt).getTime()
      if (nowMs - expTime > TWELVE_HOURS_MS) {
        return false
      }
    }
    return true
  })

  const pendingCount = activeAndRecentListings.filter((l) => l.status === 'pending').length
  const claimedCount = activeAndRecentListings.filter((l) => l.status === 'claimed').length
  const completedCount = activeAndRecentListings.filter((l) => l.status === 'picked_up').length

  const filteredListings = activeAndRecentListings.filter((l) => {
    if (filterStatus === 'all') return true
    return l.status === filterStatus
  })

  return (
    <div className="space-y-4">
      {/* 3-Step Simplified Guide (Desktop Only - Matches Claimer/NGO 3-Step Theory) */}
      <section className="hidden lg:block rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
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

      {/* Admin Verification Notice (When account is unverified) */}
      {currentUser && !currentUser.verified && currentUser.role !== 'admin' && (
        <section className="rounded-2xl border border-amber-300/80 bg-amber-50/90 p-3.5 sm:p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/40">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-xs">
              ⏳
            </span>
            <div>
              <h3 className="font-black text-amber-900 dark:text-amber-200">
                Account Pending Admin Verification
              </h3>
              <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                Welcome, <strong>{currentUser.name}</strong>. Your donor account is currently under review by ShareBite administrators. Once approved, you can post surplus food batches live on the map.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mobile Streamlined Operations & Filters Bar (Matches Claimer/NGO Mobile Alignment Theory) */}
      <section className="lg:hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#131926] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
              <Utensils size={15} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                Kitchen Operations
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Donor Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onOpenCertificate?.({ name: 'Green Bowl Kitchen', role: 'donor' })}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-300"
            >
              <Award size={13} className="text-emerald-600" />
              <span>Certificate</span>
            </button>
            <button
              onClick={onOpenModal}
              className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-black text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
            >
              <Plus size={14} />
              <span>Post Batch</span>
            </button>
          </div>
        </div>

        {/* Quick Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`shrink-0 rounded-xl px-2.5 py-1 transition ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-700 dark:bg-[#0E1420] dark:text-slate-300'
            }`}
          >
            🍽️ All ({listings.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`shrink-0 rounded-xl px-2.5 py-1 transition ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
            }`}
          >
            ⏳ Waiting ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('claimed')}
            className={`shrink-0 rounded-xl px-2.5 py-1 transition ${
              filterStatus === 'claimed'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
            }`}
          >
            🔑 Ready ({claimedCount})
          </button>
          <button
            onClick={() => setFilterStatus('picked_up')}
            className={`shrink-0 rounded-xl px-2.5 py-1 transition ${
              filterStatus === 'picked_up'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
            }`}
          >
            ✅ Rescued ({completedCount})
          </button>
        </div>
      </section>

      {/* Desktop Operations Header (Desktop Only) */}
      <section className="hidden lg:flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 shrink-0">
            <Utensils size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                Kitchen Operations
              </h1>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Donor Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Turn commercial surplus into certified CSR meals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
            onClick={() => onOpenCertificate?.({ name: 'Green Bowl Kitchen', role: 'donor' })}
          >
            <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>CSR Certificate</span>
          </button>

          <button
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
            onClick={onOpenModal}
          >
            <Plus size={15} />
            <span>Post Surplus Batch</span>
          </button>
        </div>
      </section>

      {/* Desktop Batch Status Filters */}
      <section className="hidden lg:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full">
          <button
            onClick={() => setFilterStatus('all')}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white dark:bg-emerald-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            All Batches ({listings.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            ⏳ Awaiting Pickup ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('claimed')}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'claimed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            🔑 Ready for OTP Handover ({claimedCount})
          </button>
          <button
            onClick={() => setFilterStatus('picked_up')}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'picked_up'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            ✅ Rescued ({completedCount})
          </button>
        </div>
      </section>

      {/* Main Content: Food Batches Listed Directly (Matches Claimer/NGO Feed Theory) */}
      <section className="grid gap-4">
        {filteredListings.length === 0 ? (
          <EmptyState
            title="No food batches in this category"
            message="Click '+ Post Batch' to register excess food from your restaurant or catering kitchen."
            actionText="+ Post Surplus Batch Now"
            onAction={onOpenModal}
          />
        ) : (
          filteredListings.map((listing) => (
            <FoodCard
              key={listing.id}
              listing={listing}
              donorMode
              userLocation={userLocation}
              onVerifyOTP={onVerifyOTP}
            />
          ))
        )}
      </section>

      {/* Mobile Collapsible Impact Analytics Button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileChart(!showMobileChart)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-[#131926] dark:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <BarChart3 size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>Environmental &amp; CSR Impact Metrics</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <span>{showMobileChart ? 'Hide stats' : 'View chart'}</span>
            {showMobileChart ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>
      </div>

      {/* Interactive Impact Visualizer (Desktop always, Mobile on expand or scroll) */}
      <div className={`${showMobileChart ? 'block' : 'hidden'} lg:block`}>
        <InteractiveImpactChart metrics={metrics} listings={listings} />
      </div>
    </div>
  )
}

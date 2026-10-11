import { useState } from 'react'
import {
  BarChart3,
  Check,
  Globe2,
  Leaf,
  ShieldCheck,
  Utensils,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Users,
  Search,
  RefreshCw,
  Award,
} from 'lucide-react'
import { InteractiveImpactChart } from '../ui/InteractiveImpactChart'
import { StatusBadge, FoodTypeBadge } from '../ui/Badges'

export function AdminDashboard({
  metrics,
  users = [],
  listings = [],
  ngos = [],
  onVerify,
  onToggleVerify,
  onDeleteUser,
  onDeleteListing,
  onUpdateListingStatus,
  onExtendListing,
  onBroadcastAlert,
  onOpenCertificate,
  onRefresh,
}) {
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'listings' | 'broadcast' | 'analytics'
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userSearch, setUserSearch] = useState('')
  const [listingStatusFilter, setListingStatusFilter] = useState('all')
  const [broadcastMessage, setBroadcastMessage] = useState('')

  // Filter Users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase()
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.address?.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Filter Listings
  const filteredListings = listings.filter((l) => {
    if (listingStatusFilter !== 'all' && l.status !== listingStatusFilter) return false
    return true
  })

  const unverifiedCount = users.filter((u) => !u.verified).length
  const pendingListingsCount = listings.filter((l) => l.status === 'pending').length

  function handleSendBroadcast(e) {
    e.preventDefault()
    if (!broadcastMessage.trim()) return
    onBroadcastAlert?.(broadcastMessage.trim())
    setBroadcastMessage('')
  }

  return (
    <div className="space-y-4">
      {/* Top Admin Navigation Header */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Platform Administration &amp; Governance
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Admin HQ
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full governance control over partner verification, listing moderation, and live emergency dispatch.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-100 dark:bg-[#0E1420] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>Partners ({users.length})</span>
            {unverifiedCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white">
                {unverifiedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'listings'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Utensils size={14} />
            <span>Live Batches ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'broadcast'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Emergency Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            <span>Impact Analytics</span>
          </button>
        </div>
      </section>

      {/* Metric Cards Grid */}
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60">
            <Utensils size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {metrics?.totalMealsSaved ?? listings.length * 35}
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Meals Rescued</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60">
            <Users size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {users.length}
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Registered Partners ({unverifiedCount} pending)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60">
            <Leaf size={18} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {metrics?.co2AvoidedKg ?? Math.round(listings.length * 28)}
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Est. CO₂ Avoided (kg)</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60">
            <Clock size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {pendingListingsCount}
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Active Unclaimed Batches</div>
        </div>
      </section>

      {/* TAB 1: PARTNER CREDENTIAL VERIFICATIONS & ACCESS CONTROL */}
      {activeTab === 'users' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926] space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Partner Verification &amp; Access Governance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New donors and claimers must be verified by admin before they can post or claim surplus food.
              </p>
            </div>

            {/* User Search & Role Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="h-8 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="h-8 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
              >
                <option value="all">All Roles</option>
                <option value="donor">Donors Only</option>
                <option value="claimer">Claimers / NGOs</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2.5">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-semibold">
                No users found matching filter criteria.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 sm:p-3.5 dark:border-slate-700 dark:bg-[#0E1420]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {user.name}
                      </strong>
                      <span className="rounded-md bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        {user.role}
                      </span>
                      {user.verified ? (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check size={11} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                          ⏳ Pending Approval
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {user.email} · {user.phone || 'No phone'} · {user.address || 'Address registered on pickup'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onToggleVerify?.(user.id)}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                        user.verified
                          ? 'bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                      }`}
                    >
                      <ShieldCheck size={13} />
                      <span>{user.verified ? 'Revoke Status' : 'Approve Partner'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteUser?.(user.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:border-slate-700 dark:bg-[#131926] transition"
                      title="Ban / Delete user account"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 2: LIVE SURPLUS BATCHES MODERATION & EMERGENCY OVERRIDE */}
      {activeTab === 'listings' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926] space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Live Surplus Batches Moderation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect live batches, override status, extend expiry time, or cancel fraudulent postings.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={listingStatusFilter}
                onChange={(e) => setListingStatusFilter(e.target.value)}
                className="h-8 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
              >
                <option value="all">All Batches</option>
                <option value="pending">⏳ Pending Only</option>
                <option value="claimed">🔑 Claimed Only</option>
                <option value="picked_up">✅ Rescued Only</option>
                <option value="expired">⚠️ Expired</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2.5">
            {filteredListings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-semibold">
                No surplus food batches found in this category.
              </div>
            ) : (
              filteredListings.map((batch) => (
                <div
                  key={batch.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 sm:p-3.5 dark:border-slate-700 dark:bg-[#0E1420]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {batch.foodType}
                      </strong>
                      <FoodTypeBadge category={batch.foodCategory} />
                      <StatusBadge status={batch.status} />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>{batch.donorName}</strong> · {batch.quantity} {batch.quantityUnit} · 📍 {batch.address}
                      {batch.claimedBy && <span className="ml-1 text-emerald-600 font-bold">· Claimed by: {batch.claimedBy} (OTP: {batch.otp})</span>}
                    </div>
                  </div>

                  {/* Admin Actions on Batches */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                    {batch.status !== 'picked_up' && (
                      <button
                        onClick={() => onUpdateListingStatus?.(batch.id, 'picked_up')}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                        title="Force mark as Rescued / Handed Over"
                      >
                        <CheckCircle2 size={13} />
                        <span>Force Rescued</span>
                      </button>
                    )}

                    <button
                      onClick={() => onExtendListing?.(batch.id)}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#131926] dark:text-slate-300 transition"
                      title="Extend expiry time by +2 hours"
                    >
                      <Clock size={12} />
                      <span>+2h Expiry</span>
                    </button>

                    <button
                      onClick={() => onDeleteListing?.(batch.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:border-slate-700 dark:bg-[#131926] transition"
                      title="Delete / Cancel Batch"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 3: EMERGENCY RESCUE BROADCAST */}
      {activeTab === 'broadcast' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926] space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Emergency Platform Broadcast Announcement
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Send a high-priority rescue notification across all active user sessions (e.g. large surplus batch needing immediate transport).
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <textarea
              rows={3}
              placeholder="e.g. 🚨 URGENT: 150 Portions surplus dinner available at Sector 62 Banquet. Any nearby NGO or volunteer e-rickshaw please claim and collect before 11 PM!"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Will appear as a high-visibility banner to all volunteers and NGOs.
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-amber-600/30 hover:bg-amber-700 transition active:scale-95"
              >
                <Send size={13} />
                <span>Transmit Broadcast Alert</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 4: IMPACT VISUALIZER & AUDIT CERTIFICATES */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <InteractiveImpactChart metrics={metrics} listings={listings} />

          {/* Database Status & Report Header */}
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Globe2 size={20} />
              </span>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Data Storage Engine: {metrics?.databaseEngine || 'PostgreSQL Engine'}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Real-time synchronization with OpenStreetMap Overpass &amp; PostgreSQL
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCertificate?.({ name: 'ShareBite Alliance Network', role: 'admin' })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Award size={14} className="text-emerald-600" />
                <span>Print CSR Report</span>
              </button>
              <button
                onClick={onRefresh}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                title="Refresh database records"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

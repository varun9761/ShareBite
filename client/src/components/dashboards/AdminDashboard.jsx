import { BarChart3, Check, Globe2, Leaf, ShieldCheck, Utensils } from 'lucide-react'
import { InteractiveImpactChart } from '../ui/InteractiveImpactChart'

export function AdminDashboard({
  metrics,
  users = [],
  listings = [],
  ngo = [],
  onVerify,
  onOpenCertificate,
}) {
  return (
    <div className="space-y-4">
      {/* Metric Cards Grid */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0E1420]">
            <Utensils size={22} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {metrics?.totalMealsSaved ?? '--'}
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Meals Rescued</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0E1420]">
            <BarChart3 size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {metrics?.kgRescued ?? '--'}
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Surplus Kg Diverted</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0E1420]">
            <Leaf size={22} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {metrics?.co2AvoidedKg ?? '--'}
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Est. CO₂ Avoided (kg)</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0E1420]">
            <ShieldCheck size={22} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {metrics?.verifiedPartners ?? '--'}
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Verified Partners</div>
        </div>
      </section>

      {/* Interactive Sustainability Visualizer */}
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
              Real-time synchronization with OpenStreetMap Overpass & PostgreSQL
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCertificate?.({ name: 'ShareBite Alliance Network', role: 'admin' })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Print ESG Report
          </button>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            ● Online & Synced
          </span>
        </div>
      </section>

      {/* Credential Verifications */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Partner Credential Verifications</h2>
        <div className="mt-3 grid gap-2.5">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-[#0E1420]"
            >
              <div>
                <div className="font-black text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Role: <strong className="capitalize text-slate-800 dark:text-slate-200">{user.role}</strong> · {user.email} · {user.address || 'Location registered'}
                </div>
              </div>
              {user.verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Check size={15} /> Verified
                </span>
              ) : (
                <button
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black dark:bg-emerald-600"
                  onClick={() => onVerify(user.id)}
                >
                  Verify Partner
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

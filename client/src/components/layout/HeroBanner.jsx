import { ArrowRight, Flame, HandHeart, Plus, Sparkles, Utensils } from 'lucide-react'

export function HeroBanner({ metrics, urgentCount, onOpenPostFood, onExploreNGOs }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">
          <Sparkles size={14} className="text-amber-300" />
          <span>Real-time Surplus Food Redistribution</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
          Connecting Surplus Food with Nearby Shelters & NGOs in Minutes.
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
          Restaurants, banquets, and caterers post excess meals. Verified NGOs and volunteers claim and
          redistribute them with secure OTP handoff and live GPS routing.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenPostFood}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-slate-900 shadow-lg shadow-black/20 hover:bg-emerald-50 transition active:scale-95"
          >
            <Plus size={16} className="text-emerald-600" />
            Post Surplus Batch
          </button>

          <button
            onClick={onExploreNGOs}
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition active:scale-95"
          >
            <HandHeart size={16} />
            Explore Local NGOs
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats Callouts */}
      <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 flex flex-row sm:flex-col gap-3">
        <div className="flex-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md text-center sm:text-left min-w-[130px]">
          <div className="text-xl sm:text-2xl font-black">{metrics?.totalMealsSaved ?? 1260}+</div>
          <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Meals Rescued</div>
        </div>

        <div className="flex-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md text-center sm:text-left min-w-[130px]">
          <div className="text-xl sm:text-2xl font-black">{metrics?.kgRescued ?? 384} kg</div>
          <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Surplus Diverted</div>
        </div>

        {urgentCount > 0 && (
          <div className="hidden sm:block rounded-2xl bg-amber-500/20 border border-amber-400/30 p-3 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <Flame size={14} className="animate-pulse text-amber-400" />
              <span>{urgentCount} Urgent Batches</span>
            </div>
            <div className="text-[10px] text-amber-100 mt-0.5">&lt; 1 hour remaining</div>
          </div>
        )}
      </div>
    </div>
  )
}

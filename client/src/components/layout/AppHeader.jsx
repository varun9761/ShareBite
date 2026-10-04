import {
  Compass,
  Flame,
  Leaf,
  Loader2,
  LocateFixed,
  Moon,
  Search,
  Sparkles,
  Sun,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react'

export function AppHeader({
  setView,
  metrics,
  theme,
  setTheme,
  userLocation,
  onTrackGPS,
  onOpenSearchPlace,
  locating,
  currentUser,
  onOpenAuth,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0E1420]/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        {/* Brand & Live Area */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="group flex items-center gap-3 text-left transition"
            onClick={() => setView('claimer')}
            title="Go to Home / Discovery Feed"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1 ring-1 ring-slate-200/90 shadow-md shadow-emerald-600/10 transition group-hover:scale-105 dark:bg-slate-800 dark:ring-slate-700">
              <img src="/favicon.png" alt="ShareBite Logo" className="h-full w-full object-contain drop-shadow-sm" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Share<span className="text-emerald-600">Bite</span>
                </span>
                <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Live
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Surplus Food &amp; Real-Venue Rescue
              </p>
            </div>
          </button>

          <div className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          {/* Location Badge */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 pr-2 dark:border-slate-800 dark:bg-[#131926]">
            <button
              onClick={onTrackGPS}
              disabled={locating}
              className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm hover:text-emerald-600 dark:bg-[#0E1420] dark:text-slate-200 transition"
              title="Track precise GPS position"
            >
              {locating ? (
                <Loader2 size={13} className="animate-spin text-emerald-600" />
              ) : (
                <LocateFixed size={13} className={userLocation.isLiveGPS ? 'text-emerald-600' : 'text-slate-400'} />
              )}
              <span>{userLocation.isLiveGPS ? 'GPS Locked' : 'Locate Me'}</span>
            </button>

            <button
              onClick={onOpenSearchPlace}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white truncate max-w-[180px] sm:max-w-[220px]"
              title="Search another city or locality"
            >
              <span className="truncate">{userLocation.address || 'Select City'}</span>
              <Search size={12} className="shrink-0 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* Quick Metrics */}
          <div className="hidden xl:flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Leaf size={14} className="text-emerald-600" />
              <span>{metrics?.totalMealsSaved ?? 1260}+ Meals Saved</span>
            </div>
          </div>

          {/* User Auth Info / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 pl-2.5 dark:border-slate-800 dark:bg-[#131926]">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </span>
                <div className="hidden sm:block text-left">
                  <div className="truncate font-black text-slate-900 dark:text-white max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-rose-600 dark:hover:bg-slate-800 dark:text-slate-400 transition"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-black text-white shadow-sm hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-[#131926] dark:text-slate-300 dark:hover:bg-slate-800 transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  )
}

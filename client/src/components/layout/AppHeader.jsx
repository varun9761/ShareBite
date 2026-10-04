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
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0E1420]/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        {/* Row 1 on mobile: Logo + Brand + Mobile Actions (Theme & Auth) */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <button
            className="group flex items-center gap-2.5 text-left transition"
            onClick={() => setView('claimer')}
            title="Go to Home / Discovery Feed"
          >
            <span className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1 ring-1 ring-slate-200/90 shadow-sm transition group-hover:scale-105 dark:bg-slate-800 dark:ring-slate-700">
              <img src="/favicon.png" alt="ShareBite Logo" className="h-full w-full object-contain drop-shadow-sm" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Share<span className="text-emerald-600">Bite</span>
                </span>
                <span className="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                Surplus Food Recovery
              </p>
            </div>
          </button>

          {/* Mobile Right Controls: Theme + Auth */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#131926] dark:text-slate-300 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-[#131926]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 text-slate-500 hover:text-rose-600 dark:text-slate-400"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-2.5 py-1.5 text-[11px] font-black text-white dark:bg-emerald-600 transition"
              >
                <LogIn size={12} />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Row 2 on mobile: Search Place & GPS location bar */}
        <div className="flex w-full sm:w-auto items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-[#131926]">
          <button
            onClick={onTrackGPS}
            disabled={locating}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:text-emerald-600 dark:bg-[#0E1420] dark:text-slate-200 transition"
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
            className="flex flex-1 items-center justify-between gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 min-w-0"
            title="Search another city or locality"
          >
            <span className="truncate text-left">{userLocation.address || 'Select City'}</span>
            <Search size={13} className="shrink-0 text-slate-400" />
          </button>
        </div>

        {/* Desktop Right Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
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
                <div className="text-left">
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

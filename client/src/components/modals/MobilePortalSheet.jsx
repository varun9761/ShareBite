import { X, HandHeart, Utensils, ShieldCheck, Sun, Moon, LogIn, LogOut, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react'

export function MobilePortalSheet({
  isOpen,
  onClose,
  view,
  setView,
  currentUser,
  onOpenAuth,
  onLogout,
  theme,
  setTheme,
  metrics,
  onOpenHelp,
}) {
  if (!isOpen) return null

  const roles = [
    {
      id: 'claimer',
      label: 'NGO / Claim Food',
      desc: 'Browse and claim surplus batches near you',
      icon: <HandHeart className="text-emerald-600" size={20} />,
    },
    {
      id: 'donor',
      label: 'Donor Operations',
      desc: 'Post surplus meals, manage batches & verify OTPs',
      icon: <Utensils className="text-amber-600" size={20} />,
    },
    {
      id: 'admin',
      label: 'Admin & Impact ESG',
      desc: 'Verify partner organizations & view ESG analytics',
      icon: <ShieldCheck className="text-purple-600" size={20} />,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in">
      <div
        className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-[#131926]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Account & Portal Role</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Switch workspace or manage your profile</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Status / Login */}
        <div className="my-4 rounded-2xl bg-slate-50 p-3.5 dark:bg-[#0E1420] border border-slate-200/80 dark:border-slate-800">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white text-sm shadow-md shadow-emerald-600/30">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </span>
                <div>
                  <div className="font-black text-sm text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{currentUser.role} Account</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Browsing as Guest</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Sign in to save claims & manage donations</div>
              </div>
              <button
                onClick={() => {
                  onClose()
                  onOpenAuth()
                }}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-black text-white shadow-md dark:bg-emerald-600"
              >
                <LogIn size={13} />
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Choose Workspace View
          </div>
          {roles.map((r) => {
            const active = view === r.id
            return (
              <button
                key={r.id}
                onClick={() => {
                  setView(r.id)
                  onClose()
                }}
                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all ${
                  active
                    ? 'border-2 border-emerald-600 bg-emerald-50/70 shadow-sm dark:bg-emerald-950/30'
                    : 'border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0E1420]'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-[#131926] shadow-sm shrink-0 mt-0.5">
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 dark:text-white">{r.label}</span>
                    {active && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-black text-white">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quick Settings: Theme & Help */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-indigo-500" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => {
              onClose()
              if (onOpenHelp) onOpenHelp()
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-[#0E1420] dark:text-slate-300"
          >
            <HelpCircle size={15} className="text-emerald-600" />
            <span>How it Works</span>
          </button>
        </div>
      </div>
    </div>
  )
}

import { HandHeart, Utensils, ShieldCheck, Flame } from 'lucide-react'

export function RoleSidebar({ view, setView, activeListingsCount, urgentCount }) {
  const navItems = [
    {
      id: 'claimer',
      label: 'NGO / Claim Food',
      shortLabel: 'Claim Food',
      desc: 'Discover & claim meals',
      icon: <HandHeart size={16} />,
      badge: activeListingsCount > 0 ? `${activeListingsCount} active` : null,
      urgent: urgentCount > 0 ? `${urgentCount} urgent` : null,
    },
    {
      id: 'donor',
      label: 'Donor Operations',
      shortLabel: 'Donor',
      desc: 'Post & handoff surplus',
      icon: <Utensils size={16} />,
    },
    {
      id: 'admin',
      label: 'Admin & Analytics',
      shortLabel: 'Admin',
      desc: 'Verify partners & ESG',
      icon: <ShieldCheck size={16} />,
    },
  ]

  return (
    <aside className="space-y-2">
      {/* Mobile Touch-Friendly Segmented Control */}
      <div className="flex lg:hidden items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-[#131926] border border-slate-200 dark:border-slate-800">
        {navItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-md dark:bg-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.shortLabel}</span>
              {item.urgent && !active && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Desktop Sidebar Cards */}
      <div className="hidden lg:block space-y-2">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1">
          Select Portal Role
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-start gap-1 rounded-2xl p-3.5 text-left transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 dark:bg-emerald-600 dark:shadow-emerald-600/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-[#131926] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2 font-black text-sm">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.urgent && !active && (
                    <span className="flex items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-black text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <Flame size={10} /> {item.urgent}
                    </span>
                  )}
                </div>
                <p className={`text-[11px] font-medium leading-snug ${active ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.desc}
                </p>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

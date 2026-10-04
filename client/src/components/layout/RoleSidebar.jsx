import { HandHeart, Utensils, ShieldCheck, Flame } from 'lucide-react'

export function RoleSidebar({ view, setView, activeListingsCount, urgentCount }) {
  const navItems = [
    {
      id: 'claimer',
      label: 'NGO / Claim Food',
      desc: 'Discover & claim meals',
      icon: <HandHeart size={18} />,
      badge: activeListingsCount > 0 ? `${activeListingsCount} active` : null,
      urgent: urgentCount > 0 ? `${urgentCount} urgent` : null,
    },
    {
      id: 'donor',
      label: 'Donor Operations',
      desc: 'Post & handoff surplus',
      icon: <Utensils size={18} />,
    },
    {
      id: 'admin',
      label: 'Admin & Analytics',
      desc: 'Verify partners & ESG',
      icon: <ShieldCheck size={18} />,
    },
  ]

  return (
    <aside className="space-y-2">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1">
        Select Portal Role
      </div>
      <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0">
        {navItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-1 lg:flex-none flex-col items-start gap-1 rounded-2xl p-3.5 text-left transition-all min-w-[170px] lg:min-w-0 ${
                active
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 dark:bg-emerald-600 dark:shadow-emerald-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-[#131926] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2 font-black text-xs sm:text-sm">
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
    </aside>
  )
}

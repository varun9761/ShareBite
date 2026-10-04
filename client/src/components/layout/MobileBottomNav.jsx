import { Utensils, Map, Plus, Building2, User, HandHeart } from 'lucide-react'

export function MobileBottomNav({
  view,
  setView,
  mapMode,
  setMapMode,
  discoveryTab,
  setDiscoveryTab,
  onOpenPostFood,
  onOpenPortalSheet,
  activeListingsCount = 0,
}) {
  const isFeed = view === 'claimer' && mapMode === 'list' && discoveryTab === 'food'
  const isMap = view === 'claimer' && mapMode === 'map'
  const isNGO = view === 'claimer' && discoveryTab === 'ngo'
  const isCustomRole = view === 'donor' || view === 'admin'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-[#0E1420]/95 px-2 py-1 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Feed / Food Batches */}
        <button
          onClick={() => {
            setView('claimer')
            setMapMode('list')
            setDiscoveryTab('food')
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isFeed
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <div className="relative">
            <Utensils size={19} className={isFeed ? 'stroke-[2.5]' : ''} />
            {activeListingsCount > 0 && (
              <span className="absolute -top-1 -right-2.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-black text-white">
                {activeListingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Food</span>
        </button>

        {/* 2. Map & Routes */}
        <button
          onClick={() => {
            setView('claimer')
            setMapMode('map')
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isMap
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <Map size={19} className={isMap ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-1 tracking-tight">Map</span>
        </button>

        {/* 3. Center Elevated Donate (+) Action */}
        <div className="relative -top-3">
          <button
            onClick={onOpenPostFood}
            className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/40 ring-4 ring-white dark:ring-[#0E1420] transition-transform active:scale-90 hover:scale-105"
            title="Post Surplus Food"
          >
            <Plus size={26} className="stroke-[2.5]" />
          </button>
          <div className="text-center text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 mt-0.5">
            Donate
          </div>
        </div>

        {/* 4. Partner NGOs */}
        <button
          onClick={() => {
            setView('claimer')
            setMapMode('list')
            setDiscoveryTab('ngo')
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isNGO
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <HandHeart size={19} className={isNGO ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-1 tracking-tight">NGOs</span>
        </button>

        {/* 5. Account / Role Portal Drawer */}
        <button
          onClick={onOpenPortalSheet}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isCustomRole
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <div className="relative">
            <User size={19} className={isCustomRole ? 'stroke-[2.5]' : ''} />
            {isCustomRole && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-2 ring-white dark:ring-[#0E1420]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {view === 'donor' ? 'Donor' : view === 'admin' ? 'Admin' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  )
}

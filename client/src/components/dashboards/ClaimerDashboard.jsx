import {
  Building2,
  CheckCircle2,
  HandHeart,
  Layers,
  LayoutList,
  Map,
  Navigation,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Utensils,
  Zap,
} from 'lucide-react'
import { DiscoveryTabChip } from '../ui/Badges'
import { FoodCard } from '../cards/FoodCard'
import { NGOCard } from '../cards/NGOCard'
import { DonorPartnerCard } from '../cards/DonorPartnerCard'
import { EnhancedListingMap } from '../map/EnhancedListingMap'
import { EmptyState } from '../ui/EmptyState'

export function ClaimerDashboard({
  listings = [],
  ngos = [],
  donors = [],
  loading,
  userLocation,
  radiusKm,
  setRadiusKm,
  discoveryTab,
  setDiscoveryTab,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  sortBy,
  setSortBy,
  mapMode,
  setMapMode,
  mapFilter,
  setMapFilter,
  onTrackGPS,
  onOpenSearchPlace,
  onPresetChange,
  locating,
  onClaim,
  onConnectNGO,
  onRefresh,
}) {
  return (
    <div className="space-y-4">
      {/* 3-Step Simplified NGO Guide */}
      <section className="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
          <Zap size={14} className="text-emerald-600" />
          <span>How NGO Food Rescue Works in 3 Easy Steps</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-[#131926]/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white text-[10px]">1</span>
            <div>
              <strong className="text-slate-900 dark:text-white">Find Nearby Food:</strong>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Browse live surplus batches or real restaurants within your search radius.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-[#131926]/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white text-[10px]">2</span>
            <div>
              <strong className="text-slate-900 dark:text-white">Claim & Get OTP:</strong>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Click &apos;Claim Batch&apos; to instantly reserve it and receive a 6-digit verification OTP.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-[#131926]/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-black text-white text-[10px]">3</span>
            <div>
              <strong className="text-slate-900 dark:text-white">Collect with Directions:</strong>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Use 1-tap Google Maps directions to reach the venue and show your OTP to collect!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Tabs */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <DiscoveryTabChip
            active={discoveryTab === 'food'}
            onClick={() => setDiscoveryTab('food')}
            icon={<Utensils size={15} />}
            label="Food Batches"
            count={listings.length}
          />
          <DiscoveryTabChip
            active={discoveryTab === 'donors'}
            onClick={() => setDiscoveryTab('donors')}
            icon={<Building2 size={15} />}
            label="Restaurants"
            count={donors.length}
          />
          <DiscoveryTabChip
            active={discoveryTab === 'ngo'}
            onClick={() => setDiscoveryTab('ngo')}
            icon={<HandHeart size={15} />}
            label="NGOs"
            count={ngos.length}
          />
        </div>

        {/* View Mode: List vs Interactive Map */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-[#0E1420] w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              mapMode === 'list'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            onClick={() => setMapMode('list')}
          >
            <LayoutList size={14} /> List View
          </button>
          <button
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              mapMode === 'map'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            onClick={() => setMapMode('map')}
          >
            <Map size={14} /> Map & Routes
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926] space-y-3">
        {/* Row 1: Search, Sort & Refresh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <form onSubmit={onSearchSubmit} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by food name, cuisine, donor restaurant..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white dark:focus:bg-[#0E1420] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </form>

          {/* Sort Dropdown & Refresh */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 flex-1 sm:flex-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200 cursor-pointer transition min-w-0"
            >
              <option value="expiry">⏰ Expiry (Urgent)</option>
              <option value="distance">📍 Distance (Nearest)</option>
              <option value="quantity">🍽️ Portions (Largest)</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 active:scale-95 transition dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
              title="Refresh live listings"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: Dietary Filter & Dedicated Radius Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
          {/* Dietary Buttons */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-[#0E1420] w-full sm:w-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`flex-1 sm:flex-initial text-center justify-center rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                categoryFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              🍽️ All Food
            </button>
            <button
              onClick={() => setCategoryFilter('veg')}
              className={`flex-1 sm:flex-initial text-center justify-center rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                categoryFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-600 dark:text-white'
                  : 'text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300'
              }`}
            >
              🥦 Veg
            </button>
            <button
              onClick={() => setCategoryFilter('non-veg')}
              className={`flex-1 sm:flex-initial text-center justify-center rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                categoryFilter === 'non-veg'
                  ? 'bg-rose-600 text-white shadow-sm dark:bg-rose-600 dark:text-white'
                  : 'text-slate-600 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-300'
              }`}
            >
              🍖 Non-Veg
            </button>
          </div>

          {/* Distance Slider with clear label & badge */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 bg-slate-50 dark:bg-[#0E1420] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Radius:
            </span>
            <input
              type="range"
              min="2"
              max="40"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="h-1.5 flex-1 sm:w-40 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600 dark:bg-slate-700"
            />
            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-mono font-black text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap">
              {radiusKm} km
            </span>
          </div>
        </div>
      </section>

      {/* Main Content: Map Mode vs Card List Mode */}
      {mapMode === 'map' ? (
        <EnhancedListingMap
          userLocation={userLocation}
          listings={listings}
          ngos={ngos}
          donors={donors}
          mapFilter={mapFilter}
          setMapFilter={setMapFilter}
          onClaim={onClaim}
          onConnectNGO={onConnectNGO}
        />
      ) : (
        <div className="grid gap-4">
          {discoveryTab === 'food' && (
            listings.length === 0 ? (
              <EmptyState
                title="No active surplus batches found in this radius"
                message="Try increasing your search radius or switch area presets. Check 'Real Restaurants' tab to see local donors."
              />
            ) : (
              listings.map((listing) => (
                <FoodCard key={listing.id} listing={listing} onClaim={onClaim} userLocation={userLocation} />
              ))
            )
          )}

          {discoveryTab === 'donors' && (
            donors.length === 0 ? (
              <EmptyState
                title="No restaurants detected in this zone"
                message="Try increasing your search radius to discover real eateries from OpenStreetMap."
              />
            ) : (
              donors.map((donor) => (
                <DonorPartnerCard key={donor.id} donor={donor} userLocation={userLocation} />
              ))
            )
          )}

          {discoveryTab === 'ngo' && (
            ngos.length === 0 ? (
              <EmptyState
                title="No NGO relief shelters found"
                message="We fetch live community kitchens and NGOs via OpenStreetMap. Try expanding your search radius."
              />
            ) : (
              ngos.map((ngo) => (
                <NGOCard key={ngo.id} ngo={ngo} onConnect={onConnectNGO} />
              ))
            )
          )}
        </div>
      )}
    </div>
  )
}

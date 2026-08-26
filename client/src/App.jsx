import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Beef,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Flame,
  Globe2,
  HandHeart,
  HeartHandshake,
  Info,
  Layers,
  Leaf,
  LayoutList,
  Loader2,
  LocateFixed,
  Map,
  MapPin,
  Moon,
  Navigation,
  Phone,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  TimerReset,
  TrendingUp,
  Truck,
  Utensils,
  X,
  Zap,
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

const locationPresets = [
  { label: 'Bengaluru - Koramangala', address: 'Koramangala 5th Block, Bengaluru', lat: 12.9352, lng: 77.6245 },
  { label: 'Bengaluru - Domlur / Indiranagar', address: 'Domlur & Indiranagar, Bengaluru', lat: 12.9611, lng: 77.6387 },
  { label: 'New Delhi - Connaught Place', address: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
  { label: 'Mumbai - Bandra West', address: 'Bandra West, Mumbai', lat: 19.0607, lng: 72.8362 },
  { label: 'Hyderabad - Hitec City', address: 'Hitec City, Hyderabad', lat: 17.4435, lng: 78.3772 },
  { label: 'Chennai - T Nagar', address: 'T Nagar, Chennai', lat: 13.0418, lng: 80.2341 },
  { label: 'Kolkata - Park Street', address: 'Park Street, Kolkata', lat: 22.5535, lng: 88.3512 },
  { label: 'Pune - Koregaon Park', address: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8939 },
]

// Custom Leaflet DivIcons
const foodMarkerIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker"><span></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

const ngoMarkerIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker map-marker-ngo"><span></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

const restaurantMarkerIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker map-marker-restaurant"><span></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

const userLocationIcon = L.divIcon({
  className: '',
  html: '<div class="map-marker-user"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const statusBadgeTone = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700',
  claimed: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700',
  picked_up: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-700',
  expired: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700',
}

function MapController({ center, zoom = 13 }) {
  const map = useMap()
  useEffect(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, zoom, { duration: 1.2 })
    }
  }, [center, zoom, map])
  return null
}

function App() {
  const [view, setView] = useState('claimer')
  const [theme, setTheme] = useState(() => localStorage.getItem('sharebite-theme') || 'light')

  // Live Location & Filters
  const [userLocation, setUserLocation] = useState({
    lat: locationPresets[0].lat,
    lng: locationPresets[0].lng,
    address: locationPresets[0].address,
    isLiveGPS: false,
    accuracy: null,
  })
  const [radiusKm, setRadiusKm] = useState(15)
  const [discoveryTab, setDiscoveryTab] = useState('food') // 'food' | 'ngo' | 'donors'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | 'veg' | 'non-veg'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('expiry') // 'expiry' | 'distance' | 'quantity'
  const [mapMode, setMapMode] = useState('list') // 'list' | 'map'
  const [mapFilter, setMapFilter] = useState('all') // 'all' | 'food' | 'ngo' | 'donors'

  // Data States
  const [listings, setListings] = useState([])
  const [ngos, setNgos] = useState([])
  const [donors, setDonors] = useState([])
  const [donorListings, setDonorListings] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [users, setUsers] = useState([])

  // Modal & Notification States
  const [modalOpen, setModalOpen] = useState(false)
  const [claimModalListing, setClaimModalListing] = useState(null)
  const [ngoConnectTarget, setNgoConnectTarget] = useState(null)
  const [otpVerifyTarget, setOtpVerifyTarget] = useState(null)
  const [searchPlaceModalOpen, setSearchPlaceModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)

  // Sync theme with HTML root class for precise styling
  useEffect(() => {
    localStorage.setItem('sharebite-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Fetch all nearby data based on current coordinates, radius & filters
  async function refresh(coords = userLocation, radius = radiusKm) {
    setLoading(true)
    try {
      const lat = coords.lat
      const lng = coords.lng
      const params = new URLSearchParams({
        lat,
        lng,
        radiusKm: radius,
        sortBy,
      })
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
      if (searchQuery.trim()) params.set('search', searchQuery.trim())

      const [listingsData, ngosData, donorsData, donorData, metricData, userData] = await Promise.all([
        api(`/api/listings?${params}`).catch(() => []),
        api(`/api/ngo/nearby?lat=${lat}&lng=${lng}&radiusKm=${radius}`).catch(() => []),
        api(`/api/donors/nearby?lat=${lat}&lng=${lng}&radiusKm=${radius}`).catch(() => []),
        api('/api/donor/listings').catch(() => []),
        api('/api/admin/metrics').catch(() => null),
        api('/api/admin/users').catch(() => []),
      ])

      setListings(listingsData)
      setNgos(ngosData)
      setDonors(donorsData)
      setDonorListings(donorData)
      setMetrics(metricData)
      setUsers(userData)
    } catch (err) {
      console.error('Refresh error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Exact GPS Geolocation Tracking with multi-tier fallback (Browser GPS -> Server IP Geolocation)
  async function trackExactLocation() {
    setLocating(true)
    setToast('Locating your live position...')

    const getBrowserPosition = () =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          return reject(new Error('Geolocation not supported'))
        }
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
        )
      })

    try {
      let latitude, longitude, accuracy, isGPS = true

      try {
        const position = await getBrowserPosition()
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        accuracy = Math.round(position.coords.accuracy)
      } catch (geoErr) {
        console.warn('Browser GPS unavailable/denied, checking IP location fallback...', geoErr.message)
        // Fallback to Server IP Geolocation
        const ipLoc = await api('/api/geocode/ip').catch(() => null)
        if (!ipLoc || !Number.isFinite(ipLoc.lat) || !Number.isFinite(ipLoc.lng)) {
          throw new Error('Location detection failed via GPS & IP')
        }
        latitude = ipLoc.lat
        longitude = ipLoc.lng
        accuracy = 1500
        isGPS = false
      }

      const geoRes = await api(`/api/geocode/reverse?lat=${latitude}&lng=${longitude}`).catch(() => null)
      const address = geoRes?.address || geoRes?.displayName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

      const newLoc = {
        lat: latitude,
        lng: longitude,
        address,
        isLiveGPS: isGPS,
        accuracy,
      }

      setUserLocation(newLoc)
      setToast(`📍 Location locked: ${geoRes?.city || geoRes?.street || (isGPS ? 'GPS Position' : 'Detected Area')}`)
      await refresh(newLoc, radiusKm)
    } catch (err) {
      console.warn('Location detection failed:', err)
      setToast('Could not detect position. You can search any city or select a preset.')
    } finally {
      setLocating(false)
    }
  }

  function handlePresetChange(index) {
    const preset = locationPresets[Number(index)]
    if (preset) {
      const newLoc = {
        lat: preset.lat,
        lng: preset.lng,
        address: preset.address,
        isLiveGPS: false,
        accuracy: null,
      }
      setUserLocation(newLoc)
      setToast(`Switched area to ${preset.label}`)
      refresh(newLoc, radiusKm)
    }
  }

  function handleSelectCustomLocation(place) {
    const newLoc = {
      lat: place.lat,
      lng: place.lng,
      address: place.address || place.displayName,
      isLiveGPS: true,
      accuracy: 250,
    }
    setUserLocation(newLoc)
    setSearchPlaceModalOpen(false)
    setToast(`📍 Location switched to ${place.city || place.displayName.slice(0, 30)}`)
    refresh(newLoc, radiusKm)
  }

  useEffect(() => {
    refresh(userLocation, radiusKm)
  }, [radiusKm, categoryFilter, sortBy])

  // Handle Search submit
  function handleSearchSubmit(e) {
    e?.preventDefault()
    refresh(userLocation, radiusKm)
  }

  // Create new food listing
  async function createFoodListing(payload) {
    try {
      const listing = await api('/api/listings', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setModalOpen(false)
      setToast(`🎉 ${listing.quantity} ${listing.quantityUnit} surplus food posted successfully!`)
      await refresh()
    } catch (err) {
      setToast(`Error: ${err.message}`)
    }
  }

  // Claim food listing & show OTP
  async function claimFood(id) {
    try {
      const listing = await api(`/api/listings/${id}/claim`, { method: 'POST' })
      setClaimModalListing(listing)
      setToast(`Claimed! Your Pickup OTP is ${listing.otp}`)
      await refresh()
    } catch (err) {
      setToast(`Error: ${err.message}`)
    }
  }

  // Verify pickup OTP
  async function verifyPickup(id, otp) {
    try {
      await api(`/api/listings/${id}/verify-pickup`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
      })
      setOtpVerifyTarget(null)
      setToast('✅ Food pickup confirmed & impact points updated!')
      await refresh()
    } catch (err) {
      setToast(`Error: ${err.message}`)
    }
  }

  // Verify Partner (Admin)
  async function verifyPartner(id) {
    try {
      await api(`/api/admin/users/${id}/verify`, { method: 'POST' })
      setToast('Partner credentials successfully verified')
      await refresh()
    } catch (err) {
      setToast(`Error: ${err.message}`)
    }
  }

  const urgentListingsCount = useMemo(() => {
    return listings.filter((l) => l.urgency === 'critical' || l.urgency === 'urgent').length
  }, [listings])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark bg-[#0B0F17] text-[#F8FAFC]' : 'bg-[#F4F7F2] text-[#0F172A]'}`}>
      {/* Modern App Header */}
      <AppHeader
        setView={setView}
        metrics={metrics}
        theme={theme}
        setTheme={setTheme}
        userLocation={userLocation}
        onTrackGPS={trackExactLocation}
        onOpenSearchPlace={() => setSearchPlaceModalOpen(true)}
        locating={locating}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-4 lg:px-6">
        {/* Hero Impact Banner */}
        <HeroBanner
          metrics={metrics}
          urgentCount={urgentListingsCount}
          onOpenPostFood={() => setModalOpen(true)}
          onExploreNGOs={() => {
            setView('claimer')
            setDiscoveryTab('ngo')
          }}
        />

        {/* Main Content Layout */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
          <RoleSidebar
            view={view}
            setView={setView}
            activeListingsCount={listings.length}
            urgentCount={urgentListingsCount}
          />

          <div className="min-w-0 space-y-4">
            {view === 'claimer' && (
              <ClaimerDashboard
                listings={listings}
                ngos={ngos}
                donors={donors}
                loading={loading}
                userLocation={userLocation}
                radiusKm={radiusKm}
                setRadiusKm={setRadiusKm}
                discoveryTab={discoveryTab}
                setDiscoveryTab={setDiscoveryTab}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                sortBy={sortBy}
                setSortBy={setSortBy}
                mapMode={mapMode}
                setMapMode={setMapMode}
                mapFilter={mapFilter}
                setMapFilter={setMapFilter}
                onTrackGPS={trackExactLocation}
                onOpenSearchPlace={() => setSearchPlaceModalOpen(true)}
                onPresetChange={handlePresetChange}
                locating={locating}
                onClaim={claimFood}
                onConnectNGO={(ngo) => setNgoConnectTarget(ngo)}
                onRefresh={() => refresh(userLocation, radiusKm)}
              />
            )}

            {view === 'donor' && (
              <DonorDashboard
                listings={donorListings}
                metrics={metrics}
                onOpenModal={() => setModalOpen(true)}
                onVerifyOTP={(listing) => setOtpVerifyTarget(listing)}
              />
            )}

            {view === 'admin' && (
              <AdminDashboard
                metrics={metrics}
                users={users}
                listings={donorListings}
                ngos={ngos}
                onVerify={verifyPartner}
              />
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/40 transition hover:scale-110 active:scale-95"
        onClick={() => setModalOpen(true)}
        title="Post Surplus Food Batch"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      {modalOpen && (
        <FoodModal
          userLocation={userLocation}
          onClose={() => setModalOpen(false)}
          onSubmit={createFoodListing}
          onTrackGPS={trackExactLocation}
          locating={locating}
        />
      )}

      {searchPlaceModalOpen && (
        <LocationSearchModal
          onClose={() => setSearchPlaceModalOpen(false)}
          onSelect={handleSelectCustomLocation}
        />
      )}

      {claimModalListing && (
        <ClaimSuccessModal
          listing={claimModalListing}
          onClose={() => setClaimModalListing(null)}
        />
      )}

      {ngoConnectTarget && (
        <NGOConnectModal
          ngo={ngoConnectTarget}
          onClose={() => setNgoConnectTarget(null)}
          onOpenPostFood={() => {
            setNgoConnectTarget(null)
            setModalOpen(true)
          }}
        />
      )}

      {otpVerifyTarget && (
        <OTPVerifyModal
          listing={otpVerifyTarget}
          onClose={() => setOtpVerifyTarget(null)}
          onVerify={(otp) => verifyPickup(otpVerifyTarget.id, otp)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

function AppHeader({ setView, metrics, theme, setTheme, userLocation, onTrackGPS, onOpenSearchPlace, locating }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0E1420]/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="flex items-center justify-between">
          <button className="group flex items-center gap-3 text-left" onClick={() => setView('claimer')}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 transition group-hover:scale-105">
              <HandHeart size={24} />
            </span>
            <span>
              <span className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                ShareBite
                <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  LIVE 2.0
                </span>
              </span>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Surplus Food Recovery & Real-Time NGO Network
              </span>
            </span>
          </button>
        </div>

        {/* Header Right Stats & Location */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Location Radar Pill */}
          <button
            onClick={onTrackGPS}
            disabled={locating}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition shadow-sm ${
              userLocation.isLiveGPS
                ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:bg-[#131926] dark:text-slate-200'
            }`}
            title="Click to detect current live position"
          >
            {locating ? (
              <Loader2 size={14} className="animate-spin text-blue-600" />
            ) : userLocation.isLiveGPS ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
              </span>
            ) : (
              <LocateFixed size={14} className="text-slate-500 dark:text-slate-400" />
            )}
            <span className="max-w-[160px] truncate font-bold text-slate-800 dark:text-slate-200">
              {userLocation.isLiveGPS ? 'GPS: ' : 'Area: '}
              {userLocation.address}
            </span>
          </button>

          {/* Search any place button */}
          <button
            onClick={onOpenSearchPlace}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-500 dark:border-slate-700 dark:bg-[#131926] dark:text-slate-200"
            title="Search any city or address"
          >
            <Search size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Search City</span>
          </button>

          {/* Quick Metrics */}
          <div className="hidden items-center gap-2 md:flex">
            <HeaderMetric icon={<Utensils size={14} />} value={metrics?.totalMealsSaved ?? '1,450+'} label="meals" />
            <HeaderMetric icon={<Leaf size={14} />} value={`${metrics?.co2AvoidedKg ?? '1,500+'}kg`} label="CO₂ saved" />
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:text-slate-950 dark:border-slate-700 dark:bg-[#131926] dark:text-slate-200"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function HeaderMetric({ icon, value, label }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs shadow-sm dark:border-slate-800 dark:bg-[#131926]">
      <span className="text-emerald-600 dark:text-emerald-400">{icon}</span>
      <strong className="font-black text-slate-900 dark:text-white">{value}</strong>
      <span className="font-semibold text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  )
}

function HeroBanner({ metrics, urgentCount, onOpenPostFood, onExploreNGOs }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-5 text-white shadow-xl shadow-emerald-900/15 sm:p-6">
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Sparkles size={13} className="text-amber-300" /> Real-Time Food Rescue Hub
            </span>

            {urgentCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950 animate-pulse shadow-md">
                <Flame size={13} /> {urgentCount} Urgent Batches Expiring Soon!
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Rescuing Fresh Food, Routing to Verified NGOs in Minutes.
          </h1>
          <p className="text-xs font-medium text-emerald-50 sm:text-sm">
            Connect restaurants with surplus dishes directly to nearby charities, shelter homes, and community kitchens using GPS proximity.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:shrink-0">
          <button
            onClick={onOpenPostFood}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-emerald-900 shadow-lg shadow-black/10 transition hover:bg-emerald-50 active:scale-95 sm:text-sm"
          >
            <Plus size={18} className="text-emerald-700" />
            Post Surplus Food
          </button>
          <button
            onClick={onExploreNGOs}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/25 sm:text-sm"
          >
            <HeartHandshake size={18} />
            Find Nearby NGOs
          </button>
        </div>
      </div>
    </div>
  )
}

function RoleSidebar({ view, setView, activeListingsCount, urgentCount }) {
  const items = [
    { id: 'claimer', label: 'Nearby Food & NGOs', icon: Compass, badge: activeListingsCount },
    { id: 'donor', label: 'Donor Dashboard', icon: Utensils },
    { id: 'admin', label: 'Admin Hub', icon: ShieldCheck },
  ]

  return (
    <nav className="grid grid-cols-3 gap-2 lg:sticky lg:top-20 lg:grid-cols-1 lg:self-start">
      {items.map((item) => {
        const Icon = item.icon
        const active = view === item.id
        return (
          <button
            key={item.id}
            className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold transition sm:text-sm border ${
              active
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/30 dark:bg-emerald-600 dark:border-emerald-500'
                : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:bg-[#131926] dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            onClick={() => setView(item.id)}
          >
            <span className="flex items-center gap-2.5">
              <Icon size={18} className={active ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                  active ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

function ClaimerDashboard({
  listings,
  ngos,
  donors,
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
      {/* Search & Location Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Live Search Form */}
          <form onSubmit={onSearchSubmit} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, bakery, restaurant or area..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-9 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-100 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  onRefresh()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Location & Radius Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onTrackGPS}
              disabled={locating}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-sm ${
                userLocation.isLiveGPS
                  ? 'bg-blue-600 text-white shadow-blue-600/25'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {locating ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
              {userLocation.isLiveGPS ? 'GPS Active' : 'Track GPS'}
            </button>

            <button
              onClick={onOpenSearchPlace}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm transition hover:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
            >
              <Search size={14} className="text-emerald-600" />
              <span>Search Place</span>
            </button>

            <select
              className="h-10 rounded-xl border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
              onChange={(e) => onPresetChange(e.target.value)}
            >
              {locationPresets.map((p, idx) => (
                <option key={p.label} value={idx}>{p.label}</option>
              ))}
            </select>

            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="h-10 rounded-xl border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-200"
            >
              <option value={2}>2 km radius</option>
              <option value={5}>5 km radius</option>
              <option value={10}>10 km radius</option>
              <option value={15}>15 km radius</option>
              <option value={25}>25 km radius</option>
              <option value={50}>50 km radius</option>
            </select>

            {/* List / Map View Switcher */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-[#0E1420]">
              <ToggleButton active={mapMode === 'list'} onClick={() => setMapMode('list')} icon={<LayoutList size={15} />} label="List" />
              <ToggleButton active={mapMode === 'map'} onClick={() => setMapMode('map')} icon={<Map size={15} />} label="Map" />
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Tabs & Quick Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-2 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <DiscoveryTabChip
            active={discoveryTab === 'food'}
            onClick={() => setDiscoveryTab('food')}
            icon={<Utensils size={15} />}
            label="Surplus Food"
            count={listings.length}
            color="bg-amber-600 text-white"
          />
          <DiscoveryTabChip
            active={discoveryTab === 'ngo'}
            onClick={() => setDiscoveryTab('ngo')}
            icon={<HeartHandshake size={15} />}
            label="Nearby NGOs & Charities"
            count={ngos.length}
            color="bg-blue-600 text-white"
          />
          <DiscoveryTabChip
            active={discoveryTab === 'donors'}
            onClick={() => setDiscoveryTab('donors')}
            icon={<Building2 size={15} />}
            label="Donating Restaurants"
            count={donors.length}
            color="bg-emerald-600 text-white"
          />
        </div>

        {/* Dietary & Sorting options */}
        {discoveryTab === 'food' && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-[#131926]">
              <button
                className={`rounded-lg px-2.5 py-1 font-bold ${categoryFilter === 'all' ? 'bg-slate-900 text-white dark:bg-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}
                onClick={() => setCategoryFilter('all')}
              >
                All
              </button>
              <button
                className={`rounded-lg px-2.5 py-1 font-bold ${categoryFilter === 'veg' ? 'bg-emerald-600 text-white' : 'text-emerald-800 dark:text-emerald-400'}`}
                onClick={() => setCategoryFilter('veg')}
              >
                🥗 Veg
              </button>
              <button
                className={`rounded-lg px-2.5 py-1 font-bold ${categoryFilter === 'non-veg' ? 'bg-rose-600 text-white' : 'text-rose-800 dark:text-rose-400'}`}
                onClick={() => setCategoryFilter('non-veg')}
              >
                🍗 Non-veg
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-xl border border-slate-300 bg-white px-2 text-xs font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-[#131926] dark:text-slate-200"
            >
              <option value="expiry">⏳ Expiring Soonest</option>
              <option value="distance">📍 Nearest Distance</option>
              <option value="quantity">📦 Largest Quantity</option>
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-14 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
          <Loader2 size={24} className="animate-spin text-emerald-600" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Discovering nearby food batches & NGOs...</span>
        </div>
      )}

      {/* LIST VIEW */}
      {!loading && mapMode === 'list' && (
        <>
          {discoveryTab === 'food' && (
            <div className="grid gap-4 xl:grid-cols-2">
              {listings.length === 0 ? (
                <EmptyState
                  title="No active food listings in this area"
                  message="Expand your search radius or try searching for another locality to find active food batches."
                />
              ) : (
                listings.map((listing) => (
                  <FoodCard key={listing.id} listing={listing} onClaim={onClaim} />
                ))
              )}
            </div>
          )}

          {discoveryTab === 'ngo' && (
            <div className="grid gap-4 xl:grid-cols-2">
              {ngos.length === 0 ? (
                <EmptyState
                  title="No NGOs found in current radius"
                  message="Try increasing search radius to 25km or 50km to locate community charities and shelter homes."
                />
              ) : (
                ngos.map((ngo) => (
                  <NGOCard key={ngo.id} ngo={ngo} onConnect={() => onConnectNGO(ngo)} />
                ))
              )}
            </div>
          )}

          {discoveryTab === 'donors' && (
            <div className="grid gap-4 xl:grid-cols-2">
              {donors.length === 0 ? (
                <EmptyState
                  title="No food partner places found"
                  message="No food establishments registered in this radius yet."
                />
              ) : (
                donors.map((donor) => (
                  <DonorPartnerCard key={donor.id} donor={donor} />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* MAP VIEW */}
      {!loading && mapMode === 'map' && (
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
      )}
    </div>
  )
}

function DiscoveryTabChip({ active, onClick, icon, label, count, color }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm border ${
        active
          ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:border-emerald-600'
          : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-950 dark:bg-[#131926] dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${color}`}>
          {count}
        </span>
      )}
    </button>
  )
}

function FoodCard({ listing, onClaim, donorMode = false, onVerifyOTP }) {
  const isVeg = listing.foodCategory !== 'non-veg'
  const isUrgent = listing.urgency === 'critical' || listing.urgency === 'urgent'

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isVeg
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {isVeg ? <Leaf size={24} /> : <Beef size={24} />}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-black text-slate-900 dark:text-white">
                {listing.foodType}
              </h2>
              <FoodTypeBadge category={listing.foodCategory} />
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                <Building2 size={13} className="text-emerald-600" />
                {listing.donorName}
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin size={13} />
                {listing.address}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-amber-500 to-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm animate-pulse">
              <Flame size={11} /> Urgent
            </span>
          )}
          <StatusBadge status={listing.status} />
        </div>
      </div>

      {/* Freshness Countdown Bar */}
      <div className="mt-3.5 space-y-1 rounded-xl border border-slate-200/90 bg-slate-50 p-2.5 dark:border-slate-750 dark:bg-[#1A2234]">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
            <Clock size={14} className={isUrgent ? 'text-rose-600 animate-pulse' : 'text-emerald-600'} />
            Safe Until Expiry:
          </span>
          <Countdown expiresAt={listing.expiresAt} urgent={isUrgent} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <CardStat label={listing.quantityUnit} value={listing.quantity} icon={<Utensils size={13} className="text-amber-600 dark:text-amber-400" />} />
        <CardStat label="Distance" value={`${listing.distanceKm ?? 0} km`} icon={<Navigation size={13} className="text-blue-600 dark:text-blue-400" />} />
        <CardStat label="Est. Transit" value={`~${listing.estimatedTransitMins ?? 5} min`} icon={<Truck size={13} className="text-emerald-600 dark:text-emerald-400" />} />
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <span className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-400">
          <Leaf size={13} /> Avoids ~{listing.co2AvoidedKg} kg CO₂
        </span>

        {!donorMode && listing.status === 'pending' && (
          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-orange-500/25 transition hover:brightness-110 active:scale-95"
            onClick={() => onClaim(listing.id)}
          >
            <HandHeart size={15} />
            Claim Batch for NGO
          </button>
        )}

        {donorMode && listing.status === 'claimed' && (
          <button
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            onClick={() => onVerifyOTP(listing)}
          >
            <ShieldCheck size={15} />
            Verify Pickup OTP ({listing.otp})
          </button>
        )}

        {donorMode && listing.status === 'picked_up' && (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={16} /> Successfully Rescued & Delivered
          </span>
        )}
      </div>
    </article>
  )
}

function NGOCard({ ngo, onConnect }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <HeartHandshake size={24} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-black text-slate-900 dark:text-white">{ngo.name}</h2>
              {ngo.verified && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck size={11} /> Verified NGO
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">{ngo.cause}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <MapPin size={13} className="shrink-0 text-blue-600" />
              <span className="truncate font-medium">{ngo.address}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2">
        <CardStat label="Distance" value={`${ngo.distanceKm ?? 0} km`} icon={<Navigation size={13} className="text-blue-600 dark:text-blue-400" />} />
        <CardStat label="Daily Capacity" value={`${ngo.capacity ?? 500} meals`} icon={<Utensils size={13} className="text-amber-600 dark:text-amber-400" />} />
        <CardStat label="Operating Hours" value={ngo.operatingHours?.slice(0, 13) || '24 Hours'} icon={<Clock size={13} className="text-emerald-600 dark:text-emerald-400" />} />
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <div className="flex items-center gap-2">
          {ngo.contactPhone && (
            <a
              href={`tel:${ngo.contactPhone}`}
              className="inline-flex items-center gap-1 font-black text-blue-600 hover:underline dark:text-blue-400"
            >
              <Phone size={13} />
              {ngo.contactPhone}
            </a>
          )}
        </div>

        <button
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
          onClick={onConnect}
        >
          <Utensils size={14} />
          Offer Surplus Food
        </button>
      </div>
    </article>
  )
}

function DonorPartnerCard({ donor }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Building2 size={24} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-black text-slate-900 dark:text-white">{donor.name}</h2>
              {donor.verified && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck size={11} /> Food Donor
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{donor.type}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <MapPin size={13} className="shrink-0 text-emerald-600" />
              <span className="truncate font-medium">{donor.address}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2">
        <CardStat label="Distance Away" value={`${donor.distanceKm ?? 0} km`} icon={<Navigation size={13} className="text-blue-600 dark:text-blue-400" />} />
        <CardStat label="Rescued Batches" value={`${donor.totalDonations ?? 0} batches`} icon={<TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" />} />
      </div>

      {donor.phone && (
        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-bold">
            <Phone size={13} /> {donor.phone}
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">Certified Surplus Donor</span>
        </div>
      )}
    </article>
  )
}

function EnhancedListingMap({ userLocation, listings, ngos, donors, mapFilter, setMapFilter, onClaim, onConnectNGO }) {
  const center = [userLocation.lat, userLocation.lng]

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#131926]">
      {/* Floating Map Layer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-[#0E1420]">
        <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white">
          <Layers size={16} className="text-emerald-600" />
          <span>Interactive Radar Map</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${mapFilter === 'all' ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-600' : 'bg-white text-slate-700 border border-slate-300 dark:bg-[#1A2234] dark:text-slate-200 dark:border-slate-700'}`}
            onClick={() => setMapFilter('all')}
          >
            All Pins
          </button>
          <button
            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${mapFilter === 'food' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-800 border border-amber-300 dark:bg-[#1A2234] dark:text-amber-300 dark:border-slate-700'}`}
            onClick={() => setMapFilter('food')}
          >
            🍲 Surplus Food ({listings.length})
          </button>
          <button
            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${mapFilter === 'ngo' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-blue-800 border border-blue-300 dark:bg-[#1A2234] dark:text-blue-300 dark:border-slate-700'}`}
            onClick={() => setMapFilter('ngo')}
          >
            🏢 NGOs ({ngos.length})
          </button>
          <button
            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${mapFilter === 'donors' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-emerald-800 border border-emerald-300 dark:bg-[#1A2234] dark:text-emerald-300 dark:border-slate-700'}`}
            onClick={() => setMapFilter('donors')}
          >
            🍽️ Restaurants ({donors.length})
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={13} className="h-[550px] w-full">
        <MapController center={center} />
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Exact Location Radar Pin */}
        <Marker position={center} icon={userLocationIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <strong className="block text-sm font-black text-blue-600">📍 Current Area Locked</strong>
              <p className="mt-1 text-slate-700 font-medium">{userLocation.address}</p>
              {userLocation.isLiveGPS && <span className="font-bold text-blue-600">✓ Live Geolocation Active</span>}
            </div>
          </Popup>
        </Marker>

        {/* Food Listings Pins */}
        {(mapFilter === 'all' || mapFilter === 'food') &&
          listings.map((l) => (
            <Marker key={l.id} position={[l.coordinates.lat, l.coordinates.lng]} icon={foodMarkerIcon}>
              <Popup>
                <div className="space-y-1.5 p-1 text-xs">
                  <div className="font-bold text-amber-700">🍲 Surplus Food Batch</div>
                  <strong className="block text-sm font-black text-slate-900">{l.foodType}</strong>
                  <p className="text-slate-700 font-medium">{l.quantity} {l.quantityUnit} · {l.foodCategory}</p>
                  <p className="text-slate-600">📍 {l.address} ({l.distanceKm} km away)</p>
                  {l.status === 'pending' && (
                    <button
                      className="mt-2 w-full rounded-lg bg-amber-600 py-1.5 font-bold text-white shadow-sm hover:bg-amber-700"
                      onClick={() => onClaim(l.id)}
                    >
                      Claim this Batch
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        {/* NGOs & Charities Pins */}
        {(mapFilter === 'all' || mapFilter === 'ngo') &&
          ngos.map((n) => (
            <Marker key={n.id} position={[n.coordinates.lat, n.coordinates.lng]} icon={ngoMarkerIcon}>
              <Popup>
                <div className="space-y-1.5 p-1 text-xs">
                  <div className="font-bold text-blue-700">🏢 NGO / Relief Center</div>
                  <strong className="block text-sm font-black text-slate-900">{n.name}</strong>
                  <p className="text-slate-700 font-medium">{n.cause}</p>
                  <p className="text-slate-600">📍 {n.address} ({n.distanceKm} km away)</p>
                  {n.contactPhone && <p className="font-bold text-slate-800">📞 {n.contactPhone}</p>}
                  <button
                    className="mt-2 w-full rounded-lg bg-blue-600 py-1.5 font-bold text-white shadow-sm hover:bg-blue-700"
                    onClick={() => onConnectNGO(n)}
                  >
                    Offer Food to this NGO
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Donating Restaurants Pins */}
        {(mapFilter === 'all' || mapFilter === 'donors') &&
          donors.map((d) => (
            <Marker key={d.id} position={[d.coordinates.lat, d.coordinates.lng]} icon={restaurantMarkerIcon}>
              <Popup>
                <div className="space-y-1 p-1 text-xs">
                  <div className="font-bold text-emerald-700">🍽️ Donating Restaurant</div>
                  <strong className="block text-sm font-black text-slate-900">{d.name}</strong>
                  <p className="text-slate-700 font-medium">{d.type}</p>
                  <p className="text-slate-600">📍 {d.address} ({d.distanceKm} km away)</p>
                  <p className="font-bold text-emerald-700">✨ {d.totalDonations} surplus batches rescued</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </section>
  )
}

function DonorDashboard({ listings, metrics, onOpenModal, onVerifyOTP }) {
  return (
    <div className="space-y-4">
      {/* Donor Header Card */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#131926]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Donor Operations Hub
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            Post excess food, manage live claims, and verify OTP handovers on site.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
          onClick={onOpenModal}
        >
          <Plus size={18} />
          Post Surplus Batch
        </button>
      </section>

      {/* Listings list */}
      <section className="grid gap-4">
        {listings.length === 0 ? (
          <EmptyState
            title="No surplus food batches posted yet"
            message="Click 'Post Surplus Batch' above to route excess meals to nearby NGOs."
          />
        ) : (
          listings.map((listing) => (
            <FoodCard key={listing.id} listing={listing} donorMode onVerifyOTP={onVerifyOTP} />
          ))
        )}
      </section>
    </div>
  )
}

function AdminDashboard({ metrics, users, listings, ngos, onVerify }) {
  return (
    <div className="space-y-4">
      {/* Metric Cards Grid */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetric icon={<Utensils size={24} className="text-emerald-600 dark:text-emerald-400" />} label="Total Meals Rescued" value={metrics?.totalMealsSaved ?? '--'} />
        <AdminMetric icon={<BarChart3 size={24} className="text-blue-600 dark:text-blue-400" />} label="Surplus Kg Diverted" value={metrics?.kgRescued ?? '--'} />
        <AdminMetric icon={<Leaf size={24} className="text-teal-600 dark:text-teal-400" />} label="Est. CO₂ Avoided (kg)" value={metrics?.co2AvoidedKg ?? '--'} />
        <AdminMetric icon={<ShieldCheck size={24} className="text-amber-600 dark:text-amber-400" />} label="Verified Partners" value={metrics?.verifiedPartners ?? '--'} />
      </section>

      {/* Database Status */}
      <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
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
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          ● Online & Synced
        </span>
      </section>

      {/* Credential Verifications */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Partner Credential Verifications</h2>
        <div className="mt-3 grid gap-2.5">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-[#0E1420]">
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

function AdminMetric({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#0E1420]">{icon}</div>
      <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</div>
    </div>
  )
}

function LocationSearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const data = await api(`/api/geocode/search?q=${encodeURIComponent(query.trim())}`)
      setResults(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Search Any City or Neighborhood</h2>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Discover surplus food & NGOs anywhere globally.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Indiranagar Bengaluru, Bandra Mumbai, Connaught Place..."
            className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            autoFocus
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </form>

        <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
          {results.length > 0 ? (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => onSelect(r)}
                className="w-full text-left rounded-xl border border-slate-200 p-3 text-xs transition hover:bg-emerald-50 hover:border-emerald-300 dark:border-slate-800 dark:hover:bg-slate-800/80"
              >
                <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-600" />
                  {r.city || r.displayName.split(',')[0]}
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate mt-0.5">
                  {r.address}
                </div>
              </button>
            ))
          ) : query && !loading ? (
            <div className="text-center py-6 text-xs text-slate-500">No matching localities found. Try typing a broader area or city name.</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function FoodModal({ userLocation, onClose, onSubmit, onTrackGPS, locating }) {
  const [saving, setSaving] = useState(false)
  const [category, setCategory] = useState('veg')
  const [presetIndex, setPresetIndex] = useState('0')
  const [addressVal, setAddressVal] = useState(userLocation.address || locationPresets[0].address)
  const [latVal, setLatVal] = useState(userLocation.lat || locationPresets[0].lat)
  const [lngVal, setLngVal] = useState(userLocation.lng || locationPresets[0].lng)

  const defaultTimes = useMemo(() => {
    const now = new Date()
    const later = new Date(now.getTime() + 4 * 60 * 60 * 1000)
    return {
      preparedAt: toDatetimeLocal(now),
      expiresAt: toDatetimeLocal(later),
    }
  }, [])

  function applyPreset(idx) {
    setPresetIndex(idx)
    const preset = locationPresets[Number(idx)]
    if (preset) {
      setAddressVal(preset.address)
      setLatVal(preset.lat)
      setLngVal(preset.lng)
    }
  }

  function applyLiveGPS() {
    setAddressVal(userLocation.address)
    setLatVal(userLocation.lat)
    setLngVal(userLocation.lng)
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    const form = new FormData(event.currentTarget)
    await onSubmit({
      donorName: form.get('donorName'),
      donorPhone: form.get('donorPhone'),
      foodType: form.get('foodType'),
      foodCategory: category,
      quantity: Number(form.get('quantity')),
      quantityUnit: form.get('quantityUnit'),
      preparedAt: new Date(form.get('preparedAt')).toISOString(),
      expiresAt: new Date(form.get('expiresAt')).toISOString(),
      address: addressVal,
      lat: Number(latVal),
      lng: Number(lngVal),
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <form className="my-6 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800" onSubmit={submit}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Post Surplus Food Batch</h2>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Instantly notify nearby NGOs and volunteers for food recovery.</p>
          </div>
          <button type="button" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Donor Establishment" name="donorName" placeholder="e.g. Green Bowl Kitchen" defaultValue="Green Bowl Kitchen" required />
            <Field label="Contact Phone" name="donorPhone" placeholder="+91 98450 12345" defaultValue="+91 98450 12345" required />
          </div>

          <Field label="Food Batch Title" name="foodType" placeholder="e.g. 40 Packed Rice & Curry Meals, Bakery Baskets" required />

          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-[#0E1420]">
            <CategoryToggle active={category === 'veg'} name="foodCategory" value="veg" icon={<Leaf size={16} />} label="Vegetarian" onChange={() => setCategory('veg')} />
            <CategoryToggle active={category === 'non-veg'} name="foodCategory" value="non-veg" icon={<Beef size={16} />} label="Non-Veg" onChange={() => setCategory('non-veg')} />
          </div>

          <div className="grid grid-cols-[1fr_130px] gap-3">
            <Field label="Quantity" name="quantity" type="number" min="1" placeholder="40" defaultValue="35" required />
            <label className="grid gap-1 text-xs font-bold text-slate-800 dark:text-slate-300">
              Unit
              <select name="quantityUnit" className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 font-bold dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-100">
                <option value="servings">servings</option>
                <option value="kg">kg</option>
                <option value="boxes">boxes</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Prepared At" name="preparedAt" type="datetime-local" defaultValue={defaultTimes.preparedAt} required />
            <Field label="Safe Until / Expires" name="expiresAt" type="datetime-local" defaultValue={defaultTimes.expiresAt} required />
          </div>

          {/* Location & GPS Autofill */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#0E1420]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Pickup Location & Coordinates</span>
              <button
                type="button"
                onClick={applyLiveGPS}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm"
              >
                <LocateFixed size={12} /> Use Current Position
              </button>
            </div>

            <div className="mt-2.5 grid gap-2.5">
              <label className="grid gap-1 text-xs font-bold text-slate-700 dark:text-slate-400">
                Select Area Preset
                <select
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 font-bold dark:border-slate-700 dark:bg-[#131926] dark:text-slate-100"
                  value={presetIndex}
                  onChange={(e) => applyPreset(e.target.value)}
                >
                  {locationPresets.map((loc, i) => (
                    <option key={loc.label} value={i}>{loc.label}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-xs font-bold text-slate-700 dark:text-slate-400">
                Pickup Address
                <input
                  type="text"
                  value={addressVal}
                  onChange={(e) => setAddressVal(e.target.value)}
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 font-bold dark:border-slate-700 dark:bg-[#131926] dark:text-slate-100"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-400">
                  Latitude
                  <input
                    type="number"
                    step="0.0001"
                    value={latVal}
                    onChange={(e) => setLatVal(e.target.value)}
                    className="h-9 rounded-xl border border-slate-300 bg-white px-2.5 text-xs text-slate-900 font-bold dark:border-slate-700 dark:bg-[#131926] dark:text-slate-100"
                    required
                  />
                </label>
                <label className="grid gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-400">
                  Longitude
                  <input
                    type="number"
                    step="0.0001"
                    value={lngVal}
                    onChange={(e) => setLngVal(e.target.value)}
                    className="h-9 rounded-xl border border-slate-300 bg-white px-2.5 text-xs text-slate-900 font-bold dark:border-slate-700 dark:bg-[#131926] dark:text-slate-100"
                    required
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-xs font-black text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-700"
          disabled={saving}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          {saving ? 'Publishing Food Listing...' : 'Publish Surplus Food Listing'}
        </button>
      </form>
    </div>
  )
}

function ClaimSuccessModal({ listing, onClose }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Check size={32} />
        </div>
        <h2 className="mt-3 text-xl font-black text-slate-900 dark:text-white">Surplus Food Claimed!</h2>
        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          Show this 6-digit OTP to the donor at <strong>{listing.address}</strong> to complete pickup.
        </p>

        <div className="my-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 ring-2 ring-emerald-500/30 dark:border-emerald-800 dark:bg-emerald-950/50">
          <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">Your Pickup Verification OTP</span>
          <div className="mt-1 text-4xl font-black tracking-widest text-emerald-700 dark:text-emerald-300">{listing.otp}</div>
        </div>

        <div className="space-y-1 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div>🍲 <strong>Batch:</strong> {listing.foodType} ({listing.quantity} {listing.quantityUnit})</div>
          <div>🏢 <strong>Donor:</strong> {listing.donorName}</div>
          <div>📍 <strong>Address:</strong> {listing.address}</div>
        </div>

        <button
          className="mt-5 w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white dark:bg-emerald-600"
          onClick={onClose}
        >
          Done & Return to Dashboard
        </button>
      </div>
    </div>
  )
}

function NGOConnectModal({ ngo, onClose, onOpenPostFood }) {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ngo.name}, ${ngo.address}`)}`

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck size={12} /> Verified Food Rescue Partner
            </span>
            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{ngo.name}</h2>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{ngo.cause}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">✕</button>
        </div>

        <div className="my-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-300">
          <div>📍 <strong>Address:</strong> {ngo.address} ({ngo.distanceKm ?? 0} km away)</div>
          <div>👥 <strong>Feeding Capacity:</strong> ~{ngo.capacity ?? 500} individuals daily</div>
          <div>⏰ <strong>Intake Hours:</strong> {ngo.operatingHours || '24/7 Intake'}</div>
          {ngo.contactPhone && (
            <div>📞 <strong>Direct Contact:</strong> <a href={`tel:${ngo.contactPhone}`} className="text-blue-600 font-black underline">{ngo.contactPhone}</a></div>
          )}
          {ngo.website && (
            <div>🌐 <strong>Website:</strong> <a href={ngo.website} target="_blank" rel="noreferrer" className="text-blue-600 font-black underline">{ngo.website}</a></div>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1A2234] dark:text-slate-200"
          >
            <Navigation size={15} /> Google Maps
          </a>
          <button
            onClick={onOpenPostFood}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
          >
            <Utensils size={15} /> Post Food for this NGO
          </button>
        </div>
      </div>
    </div>
  )
}

function OTPVerifyModal({ listing, onClose, onVerify }) {
  const [otpInput, setOtpInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleVerify(e) {
    e.preventDefault()
    setSubmitting(true)
    await onVerify(otpInput)
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <form onSubmit={handleVerify} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800" onSubmit={handleVerify}>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Verify Pickup Handover</h2>
        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          Ask the NGO claimer for the 6-digit OTP code shown on their screen.
        </p>

        <div className="mt-4">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-300">Enter 6-Digit Claimer OTP</label>
          <input
            type="text"
            maxLength={6}
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            placeholder="e.g. 582914"
            className="mt-1.5 h-12 w-full rounded-2xl border-2 border-slate-300 px-4 text-center text-2xl font-black tracking-widest text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
            required
            autoFocus
          />
        </div>

        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-slate-300 py-3 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || otpInput.length < 4}
            className="flex-1 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
          >
            {submitting ? 'Verifying...' : 'Confirm Handover'}
          </button>
        </div>
      </form>
    </div>
  )
}

function CategoryToggle({ active, name, value, icon, label, onChange }) {
  const tone =
    value === 'veg'
      ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300 dark:bg-[#1A2234] dark:text-emerald-300 dark:border-emerald-700'
      : 'bg-white text-rose-800 shadow-sm border border-rose-300 dark:bg-[#1A2234] dark:text-rose-300 dark:border-rose-700'

  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
        active ? tone : 'text-slate-600 dark:text-slate-400'
      }`}
    >
      <input className="sr-only" type="radio" name={name} value={value} checked={active} onChange={onChange} />
      {icon}
      {label}
    </label>
  )
}

function ToggleButton({ active, onClick, icon, label }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
        active ? 'bg-white text-slate-950 shadow-sm dark:bg-[#1A2234] dark:text-white' : 'text-slate-600 dark:text-slate-400'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}

function FoodTypeBadge({ category }) {
  const isVeg = category !== 'non-veg'
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ring-1 ${
        isVeg
          ? 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800'
          : 'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800'
      }`}
    >
      {isVeg ? 'Veg' : 'Non-veg'}
    </span>
  )
}

function CardStat({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 p-2.5 text-center dark:border-slate-800 dark:bg-[#1A2234]">
      <div className="flex items-center justify-center gap-1 text-sm font-black text-slate-900 dark:text-slate-100">
        {icon}
        <span>{value}</span>
      </div>
      <div className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{label}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`shrink-0 rounded-md border px-2.5 py-0.5 text-[10px] font-black uppercase ${statusBadgeTone[status] || statusBadgeTone.pending}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function Countdown({ expiresAt, urgent }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timer)
  }, [])
  const ms = Math.max(0, new Date(expiresAt) - now)
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  return (
    <span className={urgent ? 'font-black text-rose-700 dark:text-rose-400' : 'font-extrabold text-slate-900 dark:text-slate-200'}>
      {hours}h {minutes}m left
    </span>
  )
}

function EmptyState({ title, message }) {
  return (
    <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#131926]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <Search size={24} />
      </div>
      <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-xs font-semibold text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-slate-800 dark:text-slate-300">
      {label}
      <input
        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
        {...props}
      />
    </label>
  )
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4500)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-black text-white shadow-2xl dark:bg-emerald-600">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white">
        <Check size={14} />
      </span>
      {message}
    </div>
  )
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message)
  }
  return response.json()
}

function toDatetimeLocal(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return offsetDate.toISOString().slice(0, 16)
}

export default App

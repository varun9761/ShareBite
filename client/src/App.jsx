import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { api, locationPresets } from './api/client'

// Layout Components
import { AppHeader } from './components/layout/AppHeader'
import { HeroBanner } from './components/layout/HeroBanner'
import { RoleSidebar } from './components/layout/RoleSidebar'
import { Toast } from './components/layout/Toast'
import { AppFooter } from './components/layout/AppFooter'

// Dashboard Views
import { ClaimerDashboard } from './components/dashboards/ClaimerDashboard'
import { DonorDashboard } from './components/dashboards/DonorDashboard'
import { AdminDashboard } from './components/dashboards/AdminDashboard'

// Modals
import { FoodModal } from './components/modals/FoodModal'
import { LocationSearchModal } from './components/modals/LocationSearchModal'
import { ClaimSuccessModal } from './components/modals/ClaimSuccessModal'
import { NGOConnectModal } from './components/modals/NGOConnectModal'
import { OTPVerifyModal } from './components/modals/OTPVerifyModal'
import { ImpactCertificateModal } from './components/modals/ImpactCertificateModal'
import { AuthModal } from './components/modals/AuthModal'

export default function App() {
  const [view, setView] = useState('claimer') // 'claimer' | 'donor' | 'admin'
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
  const [discoveryTab, setDiscoveryTab] = useState('food') // 'food' | 'donors' | 'ngo'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | 'veg' | 'non-veg'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('expiry') // 'expiry' | 'distance' | 'quantity'
  const [mapMode, setMapMode] = useState('list') // 'list' | 'map'
  const [mapFilter, setMapFilter] = useState('all') // 'all' | 'food' | 'donors' | 'ngo'

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
  const [certificateTarget, setCertificateTarget] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sharebite-user') || 'null')
    } catch {
      return null
    }
  })
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)

  // Sync theme with HTML root class for styling
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

  // Exact GPS Geolocation Tracking with fallback to IP Geolocation
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
        console.warn('Browser GPS unavailable, using IP location fallback...', geoErr.message)
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
      console.warn('Location detection error:', err)
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

  // Automatically acquire real GPS / IP location on initial page load
  useEffect(() => {
    trackExactLocation()
  }, [])

  useEffect(() => {
    refresh(userLocation, radiusKm)
  }, [radiusKm, categoryFilter, sortBy])

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
      setToast(`🎉 ${listing.quantity} ${listing.quantityUnit} surplus food posted live!`)

      // Immediately center the view and user location on the posted food batch
      const newLoc = {
        lat: listing.coordinates?.lat ?? listing.lat,
        lng: listing.coordinates?.lng ?? listing.lng,
        address: listing.address,
        isLiveGPS: true,
      }
      setUserLocation(newLoc)
      await refresh(newLoc, radiusKm)
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

  function handleAuthSuccess(user) {
    setCurrentUser(user)
    setToast(`Welcome, ${user.name}! (${user.role.toUpperCase()})`)
    if (user.role === 'donor') setView('donor')
    else if (user.role === 'claimer') setView('claimer')
    else if (user.role === 'admin') setView('admin')
  }

  function handleLogout() {
    localStorage.removeItem('sharebite-token')
    localStorage.removeItem('sharebite-user')
    setCurrentUser(null)
    setToast('Logged out successfully.')
  }

  const urgentListingsCount = useMemo(() => {
    return listings.filter((l) => l.urgency === 'critical' || l.urgency === 'urgent').length
  }, [listings])

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${theme === 'dark' ? 'dark bg-[#0B0F17] text-[#F8FAFC]' : 'bg-[#F4F7F2] text-[#0F172A]'}`}>
      <div>
        {/* App Header */}
        <AppHeader
          setView={setView}
          metrics={metrics}
          theme={theme}
          setTheme={setTheme}
          userLocation={userLocation}
          onTrackGPS={trackExactLocation}
          onOpenSearchPlace={() => setSearchPlaceModalOpen(true)}
          locating={locating}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
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
                userLocation={userLocation}
                onOpenModal={() => setModalOpen(true)}
                onVerifyOTP={(listing) => setOtpVerifyTarget(listing)}
                onOpenCertificate={(org) => setCertificateTarget(org || { name: 'Green Bowl Kitchen', role: 'donor' })}
              />
            )}

            {view === 'admin' && (
              <AdminDashboard
                metrics={metrics}
                users={users}
                listings={donorListings}
                ngos={ngos}
                onVerify={verifyPartner}
                onOpenCertificate={(org) => setCertificateTarget(org || { name: 'ShareBite Community Alliance', role: 'admin' })}
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
          nearbyRestaurants={donors}
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

      {certificateTarget && (
        <ImpactCertificateModal
          target={certificateTarget}
          metrics={metrics}
          onClose={() => setCertificateTarget(null)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      </div>

      {/* Modern Footer with Creator Credits and Mail Us */}
      <AppFooter
        onSelectRole={(role) => setView(role)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />
    </div>
  )
}

import { useState } from 'react'
import { X, Lock, Mail, User, Phone, MapPin, Building2, HandHeart, Shield, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { api } from '../../api/client'

export function AuthModal({ onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('donor') // 'donor' | 'claimer'
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Quick Demo Logins
  async function handleDemoLogin(demoEmail, demoPassword) {
    setEmail(demoEmail)
    setPassword(demoPassword)
    await submitLogin(demoEmail, demoPassword)
  }

  async function submitLogin(loginEmail, loginPass) {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      })
      localStorage.setItem('sharebite-token', data.token)
      localStorage.setItem('sharebite-user', JSON.stringify(data.user))
      onAuthSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegister) {
        if (!name || !email || !password || !role) {
          throw new Error('Please fill in all required fields.')
        }
        const data = await api('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            phone: phone || '+91 98450 12345',
            address: address || 'Registered Hub Address',
          }),
        })
        localStorage.setItem('sharebite-token', data.token)
        localStorage.setItem('sharebite-user', JSON.stringify(data.user))
        onAuthSuccess(data.user)
        onClose()
      } else {
        await submitLogin(email, password)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-[#131926] my-4 sm:my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ShareBite Community Portal
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isRegister ? 'Create Partner Account' : 'Welcome Back'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Login Presets */}
        {!isRegister && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-[#0E1420] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
              <Sparkles size={13} className="text-amber-500" />
              <span>1-Click Instant Demo Login:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoLogin('donor@sharebite.test', 'donor123')}
                className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/80 p-2 text-center text-emerald-900 hover:bg-emerald-100 transition dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                <span className="text-base">👨‍🍳</span>
                <strong className="truncate font-black mt-0.5">Green Bowl</strong>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-300">Donor</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('ngo@sharebite.test', 'donor123')}
                className="flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 p-2 text-center text-blue-900 hover:bg-blue-100 transition dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
              >
                <span className="text-base">🤝</span>
                <strong className="truncate font-black mt-0.5">Hope Meals</strong>
                <span className="text-[9px] text-blue-700 dark:text-blue-300">NGO</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@sharebite.test', 'donor123')}
                className="flex flex-col items-center justify-center rounded-xl border border-purple-200 bg-purple-50/80 p-2 text-center text-purple-900 hover:bg-purple-100 transition dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-200"
              >
                <span className="text-base">🛡️</span>
                <strong className="truncate font-black mt-0.5">Admin</strong>
                <span className="text-[9px] text-purple-700 dark:text-purple-300">Platform</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / User Name:
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Spice Route Kitchen or Feeding Hope"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Choose Your Role:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('donor')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      role === 'donor'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Building2 size={14} />
                    Food Donor / Restaurant
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('claimer')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      role === 'claimer'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                        : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <HandHeart size={14} />
                    NGO / Volunteer
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password:
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone:
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Location / Address:
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Koramangala 5th Block, Bengaluru"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-[#0E1420] dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Register & Enter Portal' : 'Sign In to ShareBite'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          {isRegister ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false)
                  setError('')
                }}
                className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Sign In here
              </button>
            </p>
          ) : (
            <p>
              New food recovery partner?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true)
                  setError('')
                }}
                className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

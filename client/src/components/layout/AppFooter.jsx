import {
  Code2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Utensils,
  ExternalLink,
  Sparkles,
  Award,
  Globe2,
  Leaf,
  Users,
  Compass,
} from 'lucide-react'

export function AppFooter({ onSelectRole, onOpenAuth }) {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-gradient-to-b from-slate-900 via-[#0C121D] to-slate-950 text-slate-300">
      {/* Top Banner / Mission Callout */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-teal-950/30 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 shrink-0">
              <Leaf size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  ShareBite Zero Hunger & Surplus Food Rescue
                </h3>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-300 border border-emerald-500/30">
                  SDG #2 & #13
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every verified rescue preserves human dignity and measurably abates greenhouse gas emissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onSelectRole('donor')}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95 transition"
            >
              Post Food as Donor
            </button>
            <button
              onClick={() => onSelectRole('claimer')}
              className="rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-750 hover:border-slate-600 active:scale-95 transition"
            >
              Claim Food as NGO
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Platform Brand Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-slate-200 shadow-md shadow-emerald-600/20">
                <img src="/favicon.png" alt="ShareBite" className="h-full w-full object-contain" />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white">
                    Share<span className="text-emerald-400">Bite</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[9px] font-black uppercase text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  Surplus Food & Real-Venue Rescue
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              A high-impact surplus food recovery network bridging commercial restaurants, bakeries, and banquet halls
              with verified NGOs and soup kitchens in real time.
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck size={14} className="shrink-0" />
                <span>6-Digit Cryptographic OTP Handover</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                <MapPin size={14} className="shrink-0" />
                <span>Live OpenStreetMap Real-Venue Routing</span>
              </div>
            </div>
          </div>

          {/* Col 2: Engineering Team & Platform Architecture */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Code2 size={14} className="text-emerald-400" />
              Engineering &amp; Architecture
            </h4>

            {/* Professional Developer Card */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#101726] to-slate-900 p-4 shadow-lg">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-black text-white shadow-sm">
                    V
                  </span>
                  <span className="text-xs font-bold text-slate-400">&amp;</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-[11px] font-black text-white shadow-sm">
                    N
                  </span>
                </div>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Lead Developers
                </span>
              </div>

              <div className="mt-2.5">
                <h5 className="text-xs font-bold text-white">
                  Engineered by <strong className="text-emerald-400 font-black">Varun</strong> and{' '}
                  <strong className="text-teal-300 font-black">Neha</strong>
                </h5>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Full-stack surplus food redistribution architecture designed to empower local shelters with
                  real-time OpenStreetMap routing and cryptographically secured OTP handoffs.
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-slate-800/90 border border-slate-750 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  React 19
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-750 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  Express API
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-750 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  OpenStreetMap
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Mail Us & Contact Desk */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Mail size={14} className="text-emerald-400" />
              Mail Us & Contact
            </h4>

            <div className="space-y-2.5">
              <div>
                <span className="block text-[11px] font-bold text-slate-400 mb-1">Developer &amp; Platform Inquiries:</span>
                <a
                  href="mailto:varun.neha.sharebite@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition group w-full"
                >
                  <Mail size={14} className="group-hover:scale-110 transition shrink-0" />
                  <span className="truncate">varun.neha.sharebite@gmail.com</span>
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-slate-400 mb-1">24/7 Food Rescue Hotline:</span>
                <a
                  href="tel:+918000011223"
                  className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-emerald-400 transition"
                >
                  <Phone size={13} className="text-emerald-400 shrink-0" />
                  <span>+91 80000 11223 (Toll Free)</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Compass size={13} className="text-blue-400 shrink-0" />
                <span>Bengaluru Tech Hub · Pan-India Coverage</span>
              </div>
            </div>
          </div>

          {/* Col 4: Platform Portals & Navigation */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Globe2 size={14} className="text-blue-400" />
              Quick Portals
            </h4>

            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => onSelectRole('claimer')}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition text-left"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>NGO Surplus Food Discovery Feed</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('donor')}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition text-left"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Restaurant & Caterer Donation Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('admin')}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition text-left"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>ESG Impact Analytics & Certifications</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-bold"
                >
                  <Users size={13} />
                  <span>Partner Login / 1-Click Demo</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-200">ShareBite</strong>. Engineered for community food rescue by{' '}
            <span className="font-bold text-slate-200">Varun &amp; Neha</span>.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Zero Hunger Initiative</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">FSSAI Food Safety Compliance</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">OpenStreetMap Real-Data</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">CSR Tax Benefit (80G)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

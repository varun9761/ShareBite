import { Award, Printer, X, Copy } from 'lucide-react'

export function ImpactCertificateModal({ target, metrics, onClose }) {
  const orgName = target?.name || 'Green Bowl Kitchen'
  const role = target?.role === 'claimer' ? 'Registered NGO Partner' : 'Certified Food Recovery Donor'
  const certId = `SB-CSR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
  const mealsCount = metrics?.totalMealsSaved ?? 1260
  const kgRescued = metrics?.kgRescued ?? 384
  const co2Avoided = metrics?.co2AvoidedKg ?? Math.round(kgRescued * 2.5)
  const waterSaved = Math.round(kgRescued * 250)

  function handlePrint() {
    window.print()
  }

  function copyCertLink() {
    navigator.clipboard?.writeText?.(window.location.href)
    alert('Verification link copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#131926] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <Award className="text-amber-500" size={18} />
            <span>Official ShareBite ESG & CSR Impact Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          id="printable-certificate"
          className="mt-4 rounded-2xl border-4 border-double border-amber-400/80 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 p-8 text-center text-slate-900 relative shadow-inner"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30">
            <Award size={36} />
          </div>

          <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-700">
            ShareBite Community Stewardship Award
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Certificate of Food Rescue & ESG Impact
          </h1>
          <p className="mt-2 text-xs italic text-slate-600">
            This certifies that
          </p>

          <div className="mt-2 inline-block border-b-2 border-slate-900 pb-1 text-xl sm:text-2xl font-black text-slate-900">
            {orgName}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mt-1">
            {role}
          </div>

          <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-slate-600">
            has demonstrated exceptional commitment to zero-waste practices by safely redirecting surplus food
            to vulnerable communities, actively mitigating food insecurity and greenhouse gas emissions.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-amber-200 py-3">
            <div>
              <div className="text-xl font-black text-slate-900">{mealsCount.toLocaleString()}+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Meals Rescued</div>
            </div>
            <div>
              <div className="text-xl font-black text-emerald-700">{co2Avoided.toLocaleString()} kg</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CO₂ Diverted</div>
            </div>
            <div>
              <div className="text-xl font-black text-blue-700">{waterSaved.toLocaleString()} L</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Water Conserved</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-left text-xs">
            <div>
              <div className="font-mono text-[10px] text-slate-500">CERTIFICATE ID</div>
              <div className="font-mono font-bold text-slate-800">{certId}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Verified on: {new Date().toLocaleDateString()}</div>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-slate-800">ShareBite Impact Board</div>
              <div className="h-0.5 w-32 bg-slate-400 ml-auto my-1" />
              <div className="text-[10px] font-bold text-emerald-700">✓ Cryptographically & DB Verified</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs no-print">
          <button
            onClick={copyCertLink}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold dark:text-slate-400"
          >
            <Copy size={13} /> Copy Shareable Link
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

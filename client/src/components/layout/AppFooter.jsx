import { Mail, Heart, Sparkles } from 'lucide-react'

export function AppFooter({ onSelectRole, onOpenAuth }) {
  return (
    <footer className="border-t border-slate-200/90 bg-white/95 dark:border-slate-800 dark:bg-[#0E1420]/95 py-6 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand & Devs */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white p-0.5 ring-1 ring-slate-200 shadow-sm dark:bg-slate-800 dark:ring-slate-700">
              <img src="/favicon.png" alt="ShareBite" className="h-full w-full object-contain" />
            </span>
            <span className="font-black text-slate-900 dark:text-white text-sm">
              Share<span className="text-emerald-600">Bite</span>
            </span>
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <p className="text-slate-500 dark:text-slate-400">
            Engineered with <Heart size={12} className="inline text-rose-500 fill-rose-500 mx-0.5 -mt-0.5" /> by{' '}
            <strong className="text-slate-800 dark:text-slate-200">Varun</strong> &amp;{' '}
            <strong className="text-slate-800 dark:text-slate-200">Neha</strong>
          </p>
        </div>

        {/* Quick Nav Portals */}
        <div className="flex flex-wrap items-center justify-center gap-4 font-bold text-slate-600 dark:text-slate-400 text-[11px]">
          <button
            onClick={() => onSelectRole('claimer')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            Food Feed
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectRole('donor')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            Donor Hub
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectRole('admin')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            Admin Panel
          </button>
          <span>·</span>
          <button
            onClick={onOpenAuth}
            className="text-emerald-600 dark:text-emerald-400 hover:underline transition"
          >
            Partner Login
          </button>
        </div>

        {/* Mail Us & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-right">
          <a
            href="mailto:varun.neha.sharebite@gmail.com"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-semibold transition"
            title="Mail Varun & Neha"
          >
            <Mail size={13} className="text-emerald-600 shrink-0" />
            <span>varun.neha.sharebite@gmail.com</span>
          </a>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            © {new Date().getFullYear()} ShareBite
          </span>
        </div>
      </div>
    </footer>
  )
}

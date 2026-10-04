import { useState } from 'react'
import { Calendar, Leaf, Droplets, Truck } from 'lucide-react'

export function InteractiveImpactChart({ metrics, listings = [] }) {
  const [activeTab, setActiveTab] = useState('weekly')
  const [selectedDayIndex, setSelectedDayIndex] = useState(3)

  const weeklyData = [
    { day: 'Mon', date: 'Sep 15', meals: 185, kg: 58, co2: 145 },
    { day: 'Tue', date: 'Sep 16', meals: 240, kg: 76, co2: 190 },
    { day: 'Wed', date: 'Sep 17', meals: 210, kg: 67, co2: 168 },
    { day: 'Thu', date: 'Sep 18', meals: 320, kg: 102, co2: 255 },
    { day: 'Fri', date: 'Sep 19', meals: 290, kg: 92, co2: 230 },
    { day: 'Sat', date: 'Sep 20', meals: 380, kg: 121, co2: 303 },
    { day: 'Sun', date: 'Sep 21', meals: 345, kg: 110, co2: 275 },
  ]

  const maxMeals = Math.max(...weeklyData.map((d) => d.meals))
  const selectedDay = weeklyData[selectedDayIndex]

  const categories = [
    { name: 'Prepared Cooked Meals', share: 52, color: 'bg-emerald-500', count: '655+ meals' },
    { name: 'Bakery & Fresh Breads', share: 24, color: 'bg-amber-500', count: '302+ kg' },
    { name: 'Fresh Fruits & Farm Produce', share: 15, color: 'bg-blue-500', count: '189+ kg' },
    { name: 'Dairy & Packaged Groceries', share: 9, color: 'bg-purple-500', count: '114+ packs' },
  ]

  const totalKg = metrics?.kgRescued ?? 384
  const co2Avoided = metrics?.co2AvoidedKg ?? Math.round(totalKg * 2.5)
  const waterSavedLiters = Math.round(totalKg * 250)
  const carKmSaved = Math.round(co2Avoided / 0.192)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#131926]">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Environmental & Community Impact Visualizer
            </h2>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Verified
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Real-time calculation of surplus food diversion and greenhouse gas abatement.
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          <button
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'weekly'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Trend
          </button>
          <button
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'categories'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2234] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Category Share
          </button>
        </div>
      </div>

      {activeTab === 'weekly' ? (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            {weeklyData.map((item, idx) => {
              const heightPct = Math.round((item.meals / maxMeals) * 100)
              const isSelected = selectedDayIndex === idx
              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                  onClick={() => setSelectedDayIndex(idx)}
                >
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    {item.meals}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/30'
                          : 'bg-emerald-500/60 group-hover:bg-emerald-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold transition ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400 scale-110'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>

          {selectedDay && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                <Calendar size={15} className="text-emerald-600" />
                <span>Selected: <strong>{selectedDay.day} ({selectedDay.date})</strong></span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-700 dark:text-slate-300">
                <span>🍽️ <strong>{selectedDay.meals}</strong> meals rescued</span>
                <span>📦 <strong>{selectedDay.kg} kg</strong> diverted</span>
                <span>🍃 <strong>{selectedDay.co2} kg</strong> CO₂ avoided</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-3.5">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">{cat.name}</span>
                <span className="text-slate-500 font-medium dark:text-slate-400">
                  {cat.count} · <strong className="text-emerald-600 dark:text-emerald-400">{cat.share}%</strong>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${cat.color}`}
                  style={{ width: `${cat.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-[#0E1420]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <Leaf size={18} />
          </span>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">CO₂ Footprint Prevented</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">~{co2Avoided.toLocaleString()} kg CO₂e</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-[#0E1420]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Droplets size={18} />
          </span>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Fresh Water Conserved</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">~{waterSavedLiters.toLocaleString()} Liters</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-[#0E1420]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Truck size={18} />
          </span>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Car Emissions Neutralized</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">~{carKmSaved.toLocaleString()} km driving</div>
          </div>
        </div>
      </div>
    </div>
  )
}

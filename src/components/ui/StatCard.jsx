import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from './Card'

export default function StatCard({ icon, label, value, sub, trend, trendUp }) {
  return (
    <Card className="relative overflow-hidden">
      {/* Decorative glow corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--primary-glow)] rounded-[0_16px_0_80px] pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="bg-[var(--primary-glow)] rounded-xl p-2.5 text-[var(--primary)] flex items-center">
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend}
          </span>
        )}
      </div>

      <div className="text-3xl font-extrabold text-[var(--text)] tracking-tight">{value}</div>
      <div className="text-[13px] text-[var(--muted)] mt-1">{label}</div>
      {sub && <div className="text-[11px] text-[var(--subtle)] mt-1.5">{sub}</div>}
    </Card>
  )
}

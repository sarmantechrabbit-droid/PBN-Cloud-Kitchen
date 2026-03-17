import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from './Card'

export default function StatCard({ icon, label, value, sub, trend, trendUp }) {
  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative glow corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: 'var(--primary-glow)',
        borderRadius: '0 16px 0 80px',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          background: 'var(--primary-glow)',
          borderRadius: 10, padding: 10,
          color: 'var(--primary)',
          display: 'flex', alignItems: 'center',
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 12, fontWeight: 700,
            color: trendUp ? 'var(--success)' : 'var(--danger)',
          }}>
            {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend}
          </span>
        )}
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 6 }}>{sub}</div>}
    </Card>
  )
}

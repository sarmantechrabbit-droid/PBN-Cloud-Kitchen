import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

const configs = {
  Completed: { bg: 'var(--success-glow)',  color: 'var(--success)',  icon: <CheckCircle size={11} /> },
  Pending:   { bg: 'var(--warning-glow)',  color: 'var(--warning)',  icon: <Clock size={11} /> },
  Submitted: { bg: 'var(--info-glow)',     color: 'var(--info)',     icon: <Clock size={11} /> },
  Pass:      { bg: 'var(--success-glow)',  color: 'var(--success)',  icon: <CheckCircle size={11} /> },
  Fail:      { bg: 'var(--danger-glow)',   color: 'var(--danger)',   icon: <XCircle size={11} /> },
  Review:    { bg: 'var(--warning-glow)',  color: 'var(--warning)',  icon: <AlertTriangle size={11} /> },
  Low:       { bg: 'var(--success-glow)',  color: 'var(--success)',  icon: null },
  Medium:    { bg: 'var(--warning-glow)',  color: 'var(--warning)',  icon: null },
  High:      { bg: 'var(--danger-glow)',   color: 'var(--danger)',   icon: null },
}

export default function StatusBadge({ status }) {
  const cfg = configs[status] || configs.Pending
  return (
    <span style={{
      background: cfg.bg,
      color: cfg.color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {cfg.icon}
      {status}
    </span>
  )
}

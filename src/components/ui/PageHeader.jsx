export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: 28,
    }}>
      <div>
        <h1 style={{
          fontSize: 26, fontWeight: 800,
          color: 'var(--text)', margin: 0, letterSpacing: -0.5,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </div>
  )
}

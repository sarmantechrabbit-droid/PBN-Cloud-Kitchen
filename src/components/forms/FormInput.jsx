export default function FormInput({ label, value, onChange, placeholder, type = 'text', icon, hint, required, ...rest }) {
  return (
    <div>
      {label && (
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600,
          color: 'var(--muted)', marginBottom: 6,
        }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--primary)', display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...rest}
          className="input-field"
          style={{ paddingLeft: icon ? 38 : 14 }}
        />
      </div>
      {hint && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

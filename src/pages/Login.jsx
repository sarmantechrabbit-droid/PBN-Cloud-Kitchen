import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Lock, Mail, User } from 'lucide-react'
import Card from '../components/ui/Card'
import FormInput from '../components/forms/FormInput'

const roles = ['Chef', 'Reviewer', 'Manager', 'CRA']

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Manager')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    if (!role) {
      setError('Please select a role.')
      return
    }
    setError('')
    localStorage.setItem('ck_auth', '1')
    localStorage.setItem('ck_role', role)
    localStorage.setItem('ck_auth_email', email.trim())
    navigate('/', { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      background: 'linear-gradient(180deg, rgba(249,115,22,0.08), rgba(249,115,22,0))',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 30px var(--primary-glow-strong)',
          }}>
            <ChefHat size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>PBN Cloud Kitchen</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Admin Console</div>
          </div>
        </div>

        <Card style={{ padding: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Sign in</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
            Use any credentials to access the demo.
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pbnkitchen.com"
              type="email"
              icon={<Mail size={14} />}
              required
            />
            <FormInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              icon={<Lock size={14} />}
              required
            />

            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: 'var(--muted)', marginBottom: 6,
              }}>
                Role <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--primary)',
                }} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 38 }}
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)',
                color: 'var(--danger)',
                fontSize: 12,
                fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: 6 }}>
              Login
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}

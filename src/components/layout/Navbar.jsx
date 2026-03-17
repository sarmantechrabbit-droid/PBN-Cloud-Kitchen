import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, RotateCcw, X, Lock, LogOut, Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const recentSearches = ['Butter Chicken v3.2', 'EXP-001 – Approved', 'Quality Review Queue', 'AI Variance Report']

export default function Navbar({ sidebarWidth, onLogout }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef(null)

  const userEmail = localStorage.getItem('ck_auth_email') || 'admin@kitchen.com'
  const role = localStorage.getItem('ck_role') || 'Manager'
  const username = userEmail.split('@')[0]
  const initials = username.slice(0, 2).toUpperCase()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header style={{
        position: 'fixed', top: 0,
        left: sidebarWidth, right: 0, height: 64,
        zIndex: 90,
        background: 'var(--topbar-bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 16,
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Search bar */}
        <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search experiments, recipes, logs..."
            style={{
              width: '100%',
              background: 'var(--bg)',
              border: `1px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 10, padding: '8px 12px 8px 34px',
              color: 'var(--text)', fontSize: 13,
              outline: 'none', fontFamily: 'inherit',
              boxShadow: focused ? '0 0 0 3px var(--primary-glow)' : 'none',
              transition: 'all 0.2s',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--muted)',
              display: 'flex', alignItems: 'center',
            }}>
              <X size={13} />
            </button>
          )}

          {/* Search Dropdown */}
          {focused && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)',
              left: 0, right: 0,
              background: '#fff', borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              padding: 8, zIndex: 200,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, padding: '6px 10px 4px' }}>
                Recent Searches
              </div>
              {recentSearches.map(s => (
                <div
                  key={s}
                  onClick={() => setSearch(s)}
                  style={{
                    padding: '9px 12px', borderRadius: 8,
                    color: '#333', fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <RotateCcw size={13} color="#999" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme toggle */}
          <ThemeToggle />



          {/* User badge with dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 12px 6px 8px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10, cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-glow)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)' }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff',
              }}>
                {initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{username}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{role}</div>
              </div>
              <ChevronDown size={13} color="var(--muted)" style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</div>
                </div>
                {role !== 'CRA' && (
                <button
                  onClick={() => { setShowDropdown(false); setShowChangePassword(true) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Lock size={15} className="text-gray-400" />
                  Change Password
                </button>
                )}
                <button
                  onClick={() => { setShowDropdown(false); setShowLogoutConfirm(true) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to logout? You will need to sign in again to access the dashboard.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  Cancel
                </button>
                <button onClick={() => { setShowLogoutConfirm(false); onLogout(); navigate('/login') }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.newPass.length < 4) {
      setError('New password must be at least 4 characters.')
      return
    }
    if (form.newPass !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setSuccess(true)
    setTimeout(() => onClose(), 1500)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Password updated successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? "text" : "password"} value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all pr-10" required />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? "text" : "password"} value={form.newPass} onChange={(e) => setForm({ ...form, newPass: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all pr-10" required />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" required />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all">
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

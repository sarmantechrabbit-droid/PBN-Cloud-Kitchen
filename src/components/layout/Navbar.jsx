import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, RotateCcw, X, Lock, LogOut, Eye, EyeOff, Menu } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const recentSearches = ['Butter Chicken v3.2', 'EXP-001 – Approved', 'Quality Review Queue', 'AI Variance Report']

export default function Navbar({ collapsed, setIsMobileOpen, onLogout }) {
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
      <header
        className={`fixed top-0 right-0 h-16 z-[90] bg-[var(--topbar-bg)] border-b border-[var(--border)] flex items-center px-4 md:px-6 gap-3 md:gap-4 transition-[left] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] left-0 ${
          collapsed ? "md:left-16" : "md:left-[220px]"
        }`}
      >
        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-[var(--muted)] md:hidden hover:bg-[var(--surface-hover)] transition-colors"
        >
          <Menu size={20} />
        </button>
        {/* Search bar */}
        <div className="flex-1 max-w-[400px] relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search experiments..."
            className={`w-full bg-[var(--bg)] border rounded-[10px] py-2 pl-[34px] pr-3 text-[13px] text-[var(--text)] outline-none transition-all duration-200 ${
              focused ? "border-[var(--primary)] ring-2 ring-[var(--primary-glow)]" : "border-[var(--border)]"
            }`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--muted)] flex items-center"
            >
              <X size={13} />
            </button>
          )}

          {/* Search Dropdown */}
          {focused && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-2 z-[200]">
              <div className="text-[10px] font-bold text-[#999] uppercase tracking-wider p-[6px_10px_4px]">
                Recent Searches
              </div>
              {recentSearches.map((s) => (
                <div
                  key={s}
                  onClick={() => setSearch(s)}
                  className="p-[9px_12px] rounded-lg text-gray-800 dark:text-gray-200 text-[13px] cursor-pointer flex items-center gap-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <RotateCcw size={13} className="text-[#999]" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-[10px]">
          {/* Theme toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* User badge with dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 md:gap-[10px] p-[6px_12px_6px_8px] bg-[var(--bg)] border border-[var(--border)] rounded-[10px] cursor-pointer transition-all duration-150 hover:border-[var(--primary)] hover:bg-[var(--primary-glow)]"
            >
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-[11px] font-extrabold text-white">
                {initials}
              </div>
              <div className="text-left hidden xs:block">
                <div className="text-xs font-bold text-[var(--text)]">
                  {username}
                </div>
                <div className="text-[10px] text-[var(--muted)]">{role}</div>
              </div>
              <ChevronDown
                size={13}
                className={`text-[var(--muted)] transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fade-in"
              >
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {username}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {userEmail}
                  </div>
                </div>
                {role !== "CRA" && (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowChangePassword(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Lock size={15} className="text-gray-400" />
                    Change Password
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLogoutConfirm(true);
                  }}
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

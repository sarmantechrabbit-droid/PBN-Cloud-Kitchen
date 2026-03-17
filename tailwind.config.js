/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          dark: '#EA6C0A',
          light: 'rgba(249,115,22,0.15)',
        },
        surface: {
          DEFAULT: '#1A1D27',
          hover: '#22263A',
        },
        app: {
          bg: '#0F1117',
          border: '#2A2D3E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.3)' }, '50%': { boxShadow: '0 0 20px 4px rgba(249,115,22,0.15)' } },
      }
    },
  },
  plugins: [],
}

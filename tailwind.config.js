/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: '#0f1115',
        espresso: '#1a1d23',
        lavender: '#8b7ba8',
        'lavender-light': '#b8a9c9',
        blush: '#e8d5d5',
        offwhite: '#f6f7fb',
        cream: '#f1f2f7',
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 12px 32px -12px rgba(15, 17, 21, 0.18)',
        'glass-dark': '0 12px 32px -12px rgba(0, 0, 0, 0.55)',
        'soft': '0 6px 16px -4px rgba(15, 17, 21, 0.08), 0 2px 4px -2px rgba(15, 17, 21, 0.04)',
        'glow': '0 10px 30px -10px rgba(139, 92, 246, 0.45)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #4f46e5 100%)',
        'hero-soft': 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 100%)',
        'card-shine': 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,1) 100%)',
      },
      animation: {
        'check': 'checkPop 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        checkPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

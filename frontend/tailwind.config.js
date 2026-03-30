/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d0d1a',
        secondary: '#16213e',
        accent: '#e94560',
        border: '#0f3460',
      },
      animation: {
        'pulse-dot': 'pulse 1.5s infinite',
        'fadeIn': 'fadeIn 0.5s ease forwards',
        'ripple': 'ripple 2s infinite',
        'bounce-dot': 'bounceDot 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        bounceDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
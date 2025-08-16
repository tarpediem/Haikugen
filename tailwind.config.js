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
        // Japanese-inspired palette
        zen: {
          white: '#FEFEFE',
          black: '#1A1A1A',
          charcoal: '#2D2D2D',
          vermillion: '#E60012',
          gold: '#FFD700',
          silver: '#C0C0C0',
          sage: '#9CAF88',
          mist: '#F5F5F5',
          shadow: '#4A4A4A',
        }
      },
      fontFamily: {
        'serif': ['Noto Serif JP', 'Georgia', 'serif'],
        'sans': ['Noto Sans JP', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
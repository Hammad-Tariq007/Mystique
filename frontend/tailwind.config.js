import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      heading: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      body: ['DM Sans', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      background: '#FAFAF9', // offwhite
      foreground: '#1A1A1A', // charcoal
      charcoal: '#1A1A1A',
      offwhite: '#FAFAF9',
      grayText: '#6E6E6E',
      gold: '#D4AF37',
      peach: '#F7E8DD',
      black: '#0C0C0C',
      white: '#FFFFFF',
    },
    borderRadius: {
      none: '0px',
      sm: '0.125rem',
      DEFAULT: '0.5rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0,0,0,0.03)',
      DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
      md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
      soft: '0 4px 16px rgba(0,0,0,0.05)',
      card: '0 6px 24px rgba(0,0,0,0.08)',
      glow: '0 0 0 1px rgba(255,255,255,0.1)',
    },
    spacing: {
      px: '1px',
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
      72: '18rem',
      84: '21rem',
      96: '24rem',
      112: '28rem',
    },
    extend: {
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) both',
        slideInLeft: 'slideInLeft 0.7s cubic-bezier(0.4,0,0.2,1) both',
      },
    },
  },
  plugins: [],
}


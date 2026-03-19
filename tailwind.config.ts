import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        slideTestis: 'slideTestis 30s linear infinite',
      },
      keyframes: {
        slideTestis: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      colors: {
        black: '#060608',
        dark: '#0d0d10',
        surface: '#111114',
        green: '#2ecc8a',
        'green-dim': '#1a7a51',
        'green-faint': 'rgba(46, 204, 138, 0.07)',
        white: '#f2f0eb',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

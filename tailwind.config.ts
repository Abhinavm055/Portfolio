import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#090909',
        card: '#111111',
        surface: '#181818',
        primary: '#F5F5F5',
        secondary: '#9D9D9D',
        accent: '#DC2626',
        'accent-hover': '#EF4444',
        'dark-red': '#450A0A',
        'dark-gold': '#450A0A',
        'dark-blue': '#450A0A',
        'deep-orange': '#7F1D1D',
        'deep-gold': '#7F1D1D',
        'deep-blue': '#7F1D1D',
        glow: 'rgba(220,38,38,0.25)',
      },
      fontFamily: {
        clash: ['"Clash Display"', 'sans-serif'],
        geist: ['"Geist"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(64px,9vw,90px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        section: ['clamp(38px,5vw,54px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        body: ['18px', { lineHeight: '1.75' }],
        label: ['13px', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        card: '0 25px 80px rgba(0,0,0,0.6)',
        glow: '0 0 40px rgba(220,38,38,0.25)',
        'glow-sm': '0 0 12px rgba(220,38,38,0.4)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at center, rgba(220,38,38,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config

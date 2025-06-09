
// tailwind.config.js
module.exports = {

   content: [  './src/**/*.{js,ts,jsx,tsx,mdx}',],

  theme: {
    extend: {
      colors: {
        // Your custom color palette
        'primary-bg': '#0d1117',
        'secondary-bg': '#161b22',
        'tertiary-bg': '#21262d',
        'active-bg': '#1c2128',
        'border': '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#7d8590',
        'text-white': 'white',
        'gradient-blue': '#58a6ff',
        'gradient-purple': '#a855f7',
        'gradient-orange': '#f97316',
        'success-green': '#3fb950',
        'error-red': '#f85149',
      },
      backgroundColor: {
        'overlay-light': 'rgba(88, 166, 255, 0.1)',
        'overlay-purple': 'rgba(168, 85, 247, 0.1)',
        'navbar-bg': 'rgba(13, 17, 23, 0.95)',
        'card-bg': 'rgba(22, 27, 34, 0.8)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'spin-reverse': 'spin 1.5s linear infinite reverse',
        'pulse-scale': 'pulseScale 1.4s ease-in-out infinite both',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseScale: {
          '0%, 80%, 100%': {
            transform: 'scale(0)',
            opacity: '0.5',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        typing: {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.4',
          },
          '30%': {
            transform: 'translateY(-10px)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}

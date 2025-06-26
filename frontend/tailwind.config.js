/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0d1117',
        'secondary-bg': '#161b22', 
        'tertiary-bg': '#21262d',
        'active-bg': '#1c2128',
        'border': '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#7d8590',
        'success-green': '#3fb950',
        'error-red': '#f85149',
        'gradient-blue': '#58a6ff',
        'gradient-purple': '#a855f7',
        'gradient-orange': '#f97316',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(90deg, #5ba6ff, #a855f7)',
        'gradient-feature': 'linear-gradient(135deg, rgba(21, 26, 35, 0.8), rgba(13, 17, 23, 0.9))',
        'gradient-started': 'linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(168, 85, 247, 0.1))',
        'gradient-content': 'radial-gradient(ellipse at center, rgba(88, 166, 255, 0.1) 0%, transparent 50%)',
        'gradient-icon': 'linear-gradient(135deg, #58a6ff, #a855f7)',
        'chat-icon': 'linear-gradient(135deg, #f97316, #a855f7)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out',
        'spin-reverse': 'spin 1.5s linear infinite reverse',
        'pulse-scale': 'pulseScale 1.4s ease-in-out infinite both',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
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
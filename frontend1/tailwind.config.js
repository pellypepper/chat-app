
module.exports = {
  content: [  './src/**/*.{js,ts,jsx,tsx,mdx}',],
  theme: {
    extend: {
      animation: {
        typing: 'typing 1.4s infinite',
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

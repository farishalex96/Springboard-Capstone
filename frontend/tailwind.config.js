export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#effaf4',
          100: '#d9f2e4',
          200: '#b5e5c7',
          300: '#85d1a1',
          400: '#4fb073',
          500: '#2f8c4f',
          600: '#266c3e',
          700: '#1e5331',
          800: '#1c432a',
          900: '#173724',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15,23,42,0.12)',
        'glass-dark': '0 24px 80px rgba(0,0,0,0.28)',
      },
    },
  },
  plugins: [],
};

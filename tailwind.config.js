/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tribe: {
          black: '#09090b',
          charcoal: '#18181b',
          lime: '#a3e635',
          live: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lime: '0 0 20px rgba(163, 230, 53, 0.25)',
        live: '0 0 12px rgba(239, 68, 68, 0.5)',
      },
    },
  },
  plugins: [],
};

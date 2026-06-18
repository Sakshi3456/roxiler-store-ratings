/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#030511',
        panel: '#0b0e1f',
        border: '#1c2240',
      },
    },
  },
  plugins: [],
};

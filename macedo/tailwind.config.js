/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter-Regular', 'system-ui'],
        bold: ['Inter-Bold', 'system-ui'],
      },
    },
  },
  plugins: [],
};

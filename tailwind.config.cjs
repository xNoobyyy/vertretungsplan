/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'dark': '0 0 25px 10px rgba(0, 0, 0, 0.1);',
        'bright': '0 0 40px 5px rgba(190, 200, 255, 0.1);',
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'dark': '0 0 25px 10px rgba(0, 0, 0, 0.1);',
        'bright': '0 0 40px 5px rgba(190, 200, 255, 0.1);',
      },
      screens: {
        'pt': {'raw': '(max-aspect-ratio: 1/1)'},
        'dt': {'raw': '(min-aspect-ratio: 1/1)'}
      },
      colors: {
        primary: "#b2c6ce",
        secondary: "#eff4f6",
        text: "#424242",
        "background-dark": "#0a0a0a",
        "text-dark": "#ffffff",
        "primary-dark": "#0a0a0a",
        "secondary-dark": "#1f2629",
      }
    }
  },
  plugins: [],
};

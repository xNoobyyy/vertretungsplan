/** @type {import('tailwindcss').Config} */
module.exports = {
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
        background: "#424242"
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#b2c6ce",
          secondary: "#eff4f6",
          neutral: "#424242",
        }
      }
    ],
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: false,
  },
};

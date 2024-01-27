const {
  violet,
  blackA,
  mauve,
  green,
  crimson,
  white,
} = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...mauve,
        ...violet,
        ...green,
        ...blackA,
        ...crimson,
        primary: {
          grey: "rgb(155, 155, 155)",
          black: "rgb(27, 27, 27)",
          pink: "rgb(252, 114, 255)",
        },
        secondary: {
          black: "rgb(19, 19, 19)",
          grey: "rgba(255, 255, 255, 0.07)",
          softGrey: "rgba(152, 161, 192, 0.08)",
        },
      },
    },
  },
  plugins: [],
};

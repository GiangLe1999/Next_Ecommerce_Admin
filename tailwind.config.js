/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5542F6",
        highlight: "#EAE8FB",
        bgGray: "#FBFAFD",
      },
      screens: {
        sm: { max: "300px" },
      },
      minWidth: {
        "90px": "90px",
      },
      maxWidth: {
        "90px": "90px",
      },
    },
  },

  plugins: [],
};

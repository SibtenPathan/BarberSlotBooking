/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ecb613",
        "background-light": "#f8f8f6",
        "background-dark": "#221d10",
      },
      fontFamily: {
        display: ["Manrope"],
      },
    },
  },
  plugins: [],
};

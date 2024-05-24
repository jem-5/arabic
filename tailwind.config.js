/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#ff77e9",
      secondary: "#565584",
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["forest", "dark", "cmyk"],
  },
};

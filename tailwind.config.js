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
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s linear infinite",
        fadeIn: "fadeIn 1s ease-in forwards",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["forest", "dark", "cmyk"],
  },
};

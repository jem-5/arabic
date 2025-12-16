/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1eb854",
        secondary: "#1db88e",
        accent: "#54c7b7",
        neutral: "#19362d",
      },
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

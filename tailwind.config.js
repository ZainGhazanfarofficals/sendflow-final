/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1021",
        surface: "#111833",
        accent: "#4f8bff",
        accent2: "#78f5d7",
        textPrimary: "#e7ecff",
        textSecondary: "#c0c6e8",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(79,139,255,0.30)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./dev/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-active": "#3573fb",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};

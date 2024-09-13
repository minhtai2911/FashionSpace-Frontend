/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spinAround: {
          "0%": { transform: "rotate(0deg)" },
          "100%": {
            transform: "rotate(180deg)",
          },
        },
      },
    },
  },
  plugins: [],
};

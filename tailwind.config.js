/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        titan: ['Titan One', 'cursive'],
      },
      keyframes: {
        fly: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px) translateY(-2px)' },
        },
      },
      animation: {
        fly: 'fly 0.6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}


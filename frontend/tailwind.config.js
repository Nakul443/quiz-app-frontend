/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          dark: '#4338ca',    // indigo-700
          light: '#e0e7ff',   // indigo-100
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
          dark: '#b91c1c',    // red-700
          light: '#fee2e2',   // red-100
        },
        success: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#047857',    // emerald-700
          light: '#d1fae5',   // emerald-100
        },
        background: '#f3f4f6', // gray-100
        surface: '#ffffff',
        text: {
          DEFAULT: '#111827', // gray-900
          secondary: '#4b5563', // gray-600
          light: '#9ca3af', // gray-400
        }
      }
    },
  },
  plugins: [],
}

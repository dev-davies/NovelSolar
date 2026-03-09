/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./app/**/*.{js,vue,ts}",
    "./node_modules/@bitrix24/b24ui-nuxt/dist/**/*.{js,vue,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Deep blue
        },
        secondary: {
          DEFAULT: '#EF4444', // Bright red
        },
        background: {
          DEFAULT: '#F9FAFB', // Light gray/white
        }
      }
    },
  },
  plugins: [],
}

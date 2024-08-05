module.exports = {
  purge: {
    content: ["./src/components/**/*.{html,js,tsx,jsx,ts}"],
    enabled: process.env.NODE_ENV === 'production', // Disable purging in development
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
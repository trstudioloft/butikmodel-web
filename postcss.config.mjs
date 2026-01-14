/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- Yeni nesil parça
    autoprefixer: {},
  },
};

export default config;
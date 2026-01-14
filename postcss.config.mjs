/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- YENİ PARÇA BU
    autoprefixer: {},
  },
};

export default config;
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: '#1f8a4d',
        paleGreen: '#e9fff3',
        brandRed: '#e51b23'
      },
      borderRadius: {
        'xl-2xl': '1.25rem'
      }
    }
  },
  plugins: []
};

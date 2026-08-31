module.exports = {
  darkMode: ['variant', {
    dark: ['&:where([data-theme="dark"]', '&:where([data-theme="dark"] *)']
  }],
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#16a34a', // green-600
            dark: '#15803d', // green-700
            light: '#22c55e' // green-500
          },
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
          'shadow': 'box-shadow',
        },
        boxShadow: {
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        }
      },
    },
    plugins: [],
  }
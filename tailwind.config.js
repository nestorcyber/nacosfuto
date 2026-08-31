module.exports = {
  darkMode: ['variant', {
    dark: ['&:where([data-theme="dark"]', '&:where([data-theme="dark"] *)', '&:where(.dark, .dark *)']
  }],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nacos: {
          green: '#138601',
          dark: '#083002',
          black: '#041901',
          light: '#f2fbf1',
          white: '#ffffff',
        },
        primary: {
          50: '#f2fbf1',
          100: '#dcf6da',
          200: '#bbf0b7',
          300: '#88e482',
          400: '#4bd043',
          500: '#1fb416',
          DEFAULT: '#138601',
          600: '#138601',
          700: '#0f6c01',
          800: '#0d5602',
          dark: '#083002',
          900: '#083002',
          950: '#041b01',
        },
        green: {
          50: '#f2fbf1',
          100: '#dcf6da',
          200: '#bbf0b7',
          300: '#88e482',
          400: '#4bd043',
          500: '#1fb416',
          600: '#138601',
          700: '#0f6c01',
          800: '#0d5602',
          900: '#083002',
          950: '#041b01',
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'shadow': 'box-shadow',
      },
      boxShadow: {
        'nacos-glow': '0 0 25px -5px rgba(19, 134, 1, 0.4)',
        'nacos-dark': '0 20px 25px -5px rgba(8, 48, 2, 0.5)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "index.html"
  ],
  theme: {
    extend: {
      colors: {
        'light-primary': '#F5F5F5',
        'primary-dark': '#1A1A2E',       // Dark navy
        'primary-blue': '#0F3460',       // Deep blue
        'accent-blue': '#2998e2',        // Bright blue
        'light-bg': '#F5F5F5',
        'text-dark': '#333333',
        'text-light': '#7f8c8d',
        // Dark mode variants
        'dark-primary': '#0F172A',
        'dark-secondary': '#1E293B',
        'dark-text': '#E2E8F0'
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
      },
      animation: {
        'fadeSlideDown': 'fadeSlideDown 0.3s ease-in-out',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        fadeSlideDown: {
          'from': { opacity: '0', transform: 'translateY(-10%)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        }
      },
    },
  },
  plugins: [],
}
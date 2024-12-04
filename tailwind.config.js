module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include paths to all your components
  ],
  theme: {
    extend: {
      screens: {
        // Default breakpoints are already provided by Tailwind, but you can customize or extend them if needed.
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        // Add any custom colors if needed
        teal: {
          400: '#38b2ac',
        },
      },
      spacing: {
        // Add custom spacing if necessary
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: For better form styling
    require('@tailwindcss/aspect-ratio'), // Optional: For aspect-ratio utilities
  ],
};

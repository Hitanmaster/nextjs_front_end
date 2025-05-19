// agency-showcase/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // If you have an `app` directory for App Router (Next.js 13+), add this:
    // "./app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example: Using Inter font, ensure it's imported or linked
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // You can add custom colors here if needed
        // Example:
        // 'brand-primary': '#0070f3',
      },
      // Enabling column-fill for masonry layout
      columnFill: {
        'auto': 'auto',
        'balance': 'balance',
      },
    },
  },
  plugins: [
    // You can add Tailwind plugins here if needed
    // require('@tailwindcss/forms'), // Example plugin
  ],
}

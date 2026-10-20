// mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: '#18181b',
        border: '#27272a',
        primary: '#3b82f6',
        destructive: '#ef4444',
        emerald: '#10b981',
        amber: '#f59e0b',
      },
    },
  },
  plugins: [],
};

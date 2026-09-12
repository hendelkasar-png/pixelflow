/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        blue: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
        },
        gray: {
          light: '#F8FAFC',
          border: '#E2E8F0',
        },
        dark: '#111827',
        secondary: '#64748B',
        success: '#16A34A',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      maxWidth: {
        '7xl': '1280px',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080E1A',
        surface: '#0F1828',
        card: '#162035',
        border: '#1E2D45',
        accent: '#E63946',
        'accent-hover': '#C8303C',
        'grade-6': '#22C55E',
        'grade-5': '#86EFAC',
        'grade-4': '#F59E0B',
        'grade-3': '#F97316',
        'grade-fail': '#EF4444',
        text: '#F0F4FF',
        muted: '#8496B0',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

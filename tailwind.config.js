/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // WAVZ brand palette (from WAVZ_Fonts___Color_Schema.pdf)
        midnight: {
          DEFAULT: '#082D4A',
          light: '#0a3a5e',
          dark: '#06223A',
        },
        overjoy: {
          DEFAULT: '#FFB814',
          dark: '#F5A800',
          tint: '#FFFBF0',
          soft: '#FFF4D6',
          amber: '#8B6914',
        },
        wavzblue: {
          DEFAULT: '#1173BD',
          light: '#97CFFA',
          dark: '#0a5a99',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

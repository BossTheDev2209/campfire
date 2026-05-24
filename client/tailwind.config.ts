import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        notion: {
          primary: '#5645d4',
          primaryPressed: '#4534b3',
          primaryDeep: '#3a2a99',
          navy: '#0a1530',
          canvas: '#ffffff',
          surface: '#f6f5f4',
          surfaceSoft: '#fafaf9',
          hairline: '#e5e3df',
          hairlineSoft: '#ede9e4',
          hairlineStrong: '#c8c4be',
          ink: '#1a1a1a',
          charcoal: '#37352f',
          slate: '#5d5b54',
          steel: '#787671',
          stone: '#a4a097',
          muted: '#bbb8b1',
          success: '#1aae39',
          warning: '#dd5b00',
          error: '#e03131',
          tintPeach: '#ffe8d4',
          tintRose: '#fde0ec',
          tintMint: '#d9f3e1',
          tintLavender: '#e6e0f5',
          tintSky: '#dcecfa',
          tintYellow: '#fef7d6',
        },
      },
      borderRadius: {
        notionXs: '4px',
        notionSm: '6px',
        notionMd: '8px',
        notionLg: '12px',
        notionXl: '16px',
      },
      fontFamily: {
        notion: ['Inter', 'Notion Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

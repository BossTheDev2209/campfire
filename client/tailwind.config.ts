import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dc: {
          bg:       '#313338',
          sidebar:  '#2B2D31',
          servers:  '#1E1F22',
          input:    '#383A40',
          hover:    '#35373C',
          text:     '#DBDEE1',
          muted:    '#80848E',
          accent:   '#5865F2',
          green:    '#23A559',
          yellow:   '#F0B232',
          red:      '#F23F43',
          mention:  '#F0B232',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

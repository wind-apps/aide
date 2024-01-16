import { defineConfig } from 'windicss/helpers'
import scrollbar from '@windicss/plugin-scrollbar'

export default defineConfig({
  attributify: true,
  plugins: [
    scrollbar,
  ],
  theme: {
    fontFamily: {
      sans: ['Lexend Variable', 'sans'],
      mono: ['Fira Code Variable', 'monospace']
    },
    extend: {},
  },
  variants: {
    scrollbar: ['rounded'],
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dsv from '@rollup/plugin-dsv'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dsv()],
  server: {
    proxy: {
      '/api': {
        target: 'https://github.com/mmcghee18/bar-chart-race/blob/master/src/data',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      {
        find: '@assets',
        replacement: path.resolve(__dirname, 'src/assets'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, 'src/pages'),
      },
    ],
  },
})

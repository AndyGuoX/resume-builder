import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// build 使用相对路径，便于 GitHub Pages（子路径 / 直接打开 dist/index.html）加载 JS/CSS
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [vue()],
  // 监听 0.0.0.0，便于局域网内用本机 IP 访问（如 http://192.168.x.x:5173）
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
}))

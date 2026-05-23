import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { AntDesignXVueResolver } from 'ant-design-x-vue/resolver'

// https://vite.dev/config/
// build 使用相对路径，便于 GitHub Pages（子路径 / 直接打开 dist/index.html）加载 JS/CSS
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [
    UnoCSS(),
    vue(),
    // 自动按需引入 API（如 ant-design-vue 的 message、notification 等）
    AutoImport({
      resolvers: [AntDesignVueResolver()],
    }),
    // 自动按需引入组件（ant-design-vue + ant-design-x-vue）
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false }), AntDesignXVueResolver()],
    }),
  ],
  // 监听 0.0.0.0，便于局域网内用本机 IP 访问（如 http://192.168.x.x:5173）
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
}))

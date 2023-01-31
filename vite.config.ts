import { defineConfig, UserConfigExport, ConfigEnv } from "vite";
import qiankun from 'vite-plugin-qiankun'
import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";
import legacy from '@vitejs/plugin-legacy';
import vitePluginRequire from "vite-plugin-require";
import ViteRequireContext from '@originjs/vite-plugin-require-context'
// useDevMode 开启时与热更新插件冲突
const useDevMode = true
import { viteMockServe } from 'vite-plugin-mock'

import { QIANKUN_URL } from "./config/config"

// https://vitejs.dev/config/
export default ({ mode }: { mode: any }) => {
  const __DEV__ = mode === 'development';

  return defineConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    plugins: [
      ...(useDevMode ? [] : [reactRefresh()]),
      qiankun('eng-config', {
        useDevMode: true,
      }),
      vitePluginRequire({
        // @fileRegex RegExp
        // optional：default file processing rules are as follows
        fileRegex: /(.jsx?|.tsx?|.vue)$/
      }),
      ViteRequireContext({
        defaultRegExp: /(.jsx?|.tsx?|.vue)$/
      }
      )
      // 为打包后的文件提供传统浏览器兼容性支持 （不要再 IE11 下运行）
      // legacy({
      //     targets: ['defaults', 'not IE 11']
      // })
    ],
    base: __DEV__ ? './' : QIANKUN_URL,
    // base:"./",
    build: {
      // 设置打包后的js语法支持版本（最低支持es2015，也就是es6）
      outDir: './eng_config',
      sourcemap: true,
      target: 'es2015',
    },
    css: {
      //* css模块化
      modules: {
        // css模块化 文件以.module.[css|less|scss]结尾
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
          // 重写 less 变量，定制样式
          // modifyVars: {
          //   "@primary-color": "#e",
          // },
        },
        scss: {
          // 自动导入全局样式
          additionalData: "@import '@/styles/base.less';",
        },
      },
    },
    server: {
      port: 3300,
      proxy: {
        "/fyHome": {
          target: "http://feiyekeji.f3322.net:15001/fyHome",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fyHome/, ""),
        },
        "/api": {
          target: "http://localhost:3000/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/testApi/, ""),
        },
      },
      // 设置源是因为图片资源会找错位置所以通过这个让图片等资源不会找错
      origin: QIANKUN_URL,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  })
};

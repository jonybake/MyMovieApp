import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 核心：拦截原生引用，转到 Web 实现
      'react-native': 'react-native-web',
    },
    // 优先级排序：.web 后缀的文件会被优先加载，用于处理平台差异
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
});

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    process: JSON.stringify({
      env: {
        NODE_ENV: process.env.NODE_ENV ?? 'development',
      },
    }),
  },
  optimizeDeps: {
    force: true,
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: path.resolve(__dirname, 'node_modules/react-native-web'),
      },
      {
        find: /^react-native-svg$/,
        replacement: path.resolve(__dirname, 'src/web/react-native-svg.tsx'),
      },
      {
        find: /^react-native-screens$/,
        replacement: path.resolve(__dirname, 'src/web/react-native-screens.tsx'),
      },
      {
        find: /^react-native\/Libraries\/Utilities\/codegenNativeComponent$/,
        replacement: path.resolve(
          __dirname,
          'src/web/codegenNativeComponent.js',
        ),
      },
      {
        find: /^react-native\/Libraries\/ReactNative\/AppContainer$/,
        replacement: path.resolve(__dirname, 'src/web/AppContainer.js'),
      },
    ],
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
});

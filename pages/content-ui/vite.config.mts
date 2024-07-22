import { resolve } from 'path';
import { makeEntryPointPlugin } from '@chrome-extension-boilerplate/hmr';
import { withPageConfig, isDev } from '@chrome-extension-boilerplate/vite-config';
import svgr from 'vite-plugin-svgr';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  plugins: [isDev && makeEntryPointPlugin(), svgr()],
  publicDir: resolve(rootDir, 'public'),
  build: {
    lib: {
      entry: resolve(srcDir, 'index.tsx'),
      name: 'contentUI',
      formats: ['iife'],
      fileName: 'index',
    },
    outDir: resolve(rootDir, '..', '..', 'dist', 'content-ui'),
  },
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '');
  const PORT = 3000;

  return {
    server: {
      port: PORT,
      strictPort: true,
      host: true
    },
    preview: {
      host: true
    },
    clearScreen: false,
    define: {
      global: 'window'
    },
    base: './',
    plugins: [react(), jsconfigPaths()]
  };
});

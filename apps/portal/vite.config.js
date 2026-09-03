import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@nacos/supabase/auth': path.resolve(__dirname, '../../packages/supabase/src/auth.js'),
      '@nacos/supabase/idCard': path.resolve(__dirname, '../../packages/supabase/src/idCard.js'),
      '@nacos/supabase': path.resolve(__dirname, '../../packages/supabase/src/client.js'),
      '@nacos/ui': path.resolve(__dirname, '../../packages/ui/src/index.js'),
      '@nacos/types': path.resolve(__dirname, '../../packages/types/src/index.js'),
      '@nacos/config/academic': path.resolve(__dirname, '../../packages/config/academic.js'),
      '@nacos/config/idCardTemplate': path.resolve(__dirname, '../../packages/config/idCardTemplate.js'),
      '@nacos/config': path.resolve(__dirname, '../../packages/config/tailwind.preset.js')
    }
  },
  server: {
    port: 5174,
    host: true
  }
});

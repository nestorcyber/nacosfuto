import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Explicitly exclude backend modules
    exclude: [
      'bcrypt',
      'jsonwebtoken',
      'crypto',
      'fs',       // Node.js file system
      'path',     // Node.js path module
      'express',  // Backend framework
      'mysql',   // Database (if used)
      'mysql2/promise',
      'dotenv'
    ],
  },
  build: {
    // Ensure Vite doesn't try to bundle backend files
    rollupOptions: {
      external: [
        /^backend\/.*/, // Ignores everything in /backend
      ],
    },
  },
});
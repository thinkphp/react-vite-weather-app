import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy catre weather-api (backend Express, port 4000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});

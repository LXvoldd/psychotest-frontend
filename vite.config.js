import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://theatre-underlying-increases-grab.trycloudflare.com/api/v1',
        changeOrigin: true,
      }
    }
  }
});
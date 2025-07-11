import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression"; // ✅ Import it

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: "brotliCompress" }), // or "gzip"
  ],
  build: {
    chunkSizeWarningLimit: 800, // Optional
  },
});

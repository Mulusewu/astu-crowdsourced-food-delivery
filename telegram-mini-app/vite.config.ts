import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Official Tailwind v4 Vite plugin
import path from "path"; // Node built-in for absolute paths

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Enables Tailwind v4 with zero PostCSS hassle
  ],

  // Required for shadcn/ui + @/* alias to work at runtime (dev/build)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Optional but highly recommended for Telegram Mini Apps:
  // → Switch to terser for better compression than default esbuild
  // → Reduces bundle size → faster load in Telegram WebView
  build: {
    minify: "terser",
    terserOptions: {
      compress: true, // Aggressive compression
      mangle: true, // Shorten variable names
      // Optional: more aggressive if you test and it doesn't break
      // toplevel: true,
      // drop_console: true,  // ← Uncomment in production builds if no logging needed
    },
    // Optional: target modern browsers (Telegram uses recent WebView/Chromium)
    target: "es2022",
  },

  // Optional: Faster dev server feedback
  server: {
    hmr: true,
  },
});

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build output
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-slot", "lucide-react"],
          math: ["katex", "react-katex"],
          syntax: ["react-syntax-highlighter"],
        },
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev startup
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "katex",
      "react-katex",
      "react-syntax-highlighter",
      "lucide-react",
    ],
  },
  server: {
    // Improve dev server performance
    fs: {
      strict: true,
    },
  },
});

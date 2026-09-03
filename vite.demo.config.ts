import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// Builds the standalone 1920x1080 local preview. The output is static and can be
// opened directly from disk (the build script converts the module bundle to a
// classic script so file:// works without a dev server).
export default defineConfig({
  plugins: [react(), svgr()],
  base: "./",
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app", "localhost", "127.0.0.1"],
  },
  resolve: {
    alias: {
      "readable-stream": "vite-compatible-readable-stream",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    outDir: "demo-mode",
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "demo-shell.html"),
      },
      output: {
        format: "es",
        inlineDynamicImports: true,
      },
    },
  },
});

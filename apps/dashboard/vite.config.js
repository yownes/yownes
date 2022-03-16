import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import visualizer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [visualizer()],
    },
    manifest: "asset-manifest.json",
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});

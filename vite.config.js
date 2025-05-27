import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: false, // Disable auto-opening browser
    port: 4000, // Set default port
    strictPort: false, // Allow Vite to try another port if 4000 is in use
  },
});

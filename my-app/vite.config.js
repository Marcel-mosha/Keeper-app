import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows access from all network devices
    port: 3000, // Or any preferred port
    strictPort: true,
  },
});

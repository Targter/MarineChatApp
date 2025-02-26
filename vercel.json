import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log("VITE_BACKVER:", env.VITE_BACKVER); // Add a debug log

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKVER, // Use manually loaded env
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

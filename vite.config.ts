import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0", // ✅ Binds to all interfaces, including your IPv4
    port: 5173, // ✅ Optional: customize if needed
    strictPort: true, // ✅ Prevents auto-switching ports
  },
});

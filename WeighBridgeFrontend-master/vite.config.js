import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173
    //plugins: [react()],
  },
  html: {
    // Add the viewport meta tag to the head of the HTML
    head: {
      meta: '<meta name="viewport" content="width=device-width, initial-scale=1">'
    }
  },
});

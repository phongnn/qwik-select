import path from "node:path";
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    root: "app",
    resolve: {
      alias: {
        "qwik-select": path.resolve(__dirname, "../src"),
      },
    },
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
  };
});

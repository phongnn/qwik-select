import path from "node:path";
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    root: "example",
    resolve: {
      alias: {
        "qwik-lib-starter": path.resolve("./src/index.ts"),
      },
    },
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
  };
});

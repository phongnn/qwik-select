import path from "node:path";
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";

export default defineConfig(() => {
  return {
    root: "example",
    resolve: {
      alias: {
        "qwik-select": path.resolve("./src/index.ts"),
      },
    },
    plugins: [qwikVite()],
  };
});

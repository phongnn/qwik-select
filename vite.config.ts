import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      outDir: "dist",
      minify: false,
      // sourcemap: true,
      lib: {
        entry: "./src/index.ts",
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
      },
    },
    plugins: [qwikVite({ entryStrategy: { type: "hook" } })],
    test: {
      globals: true,
      // environment: 'jsdom',
      // setupFiles: ['<PATH_TO_SETUP_FILE>'],
      coverage: {
        reporter: "text", // ["text", "json", "html"]
      },
    },
  };
});

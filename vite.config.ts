import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: "./src/index.ts",
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
      },
    },
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

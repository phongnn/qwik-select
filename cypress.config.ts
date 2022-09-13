import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      console.log("🚀 cypress.config.ts: process.env.CI = ", process.env.CI);
      // const isDev = config.watchForFileChanges;
      // const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const port = 5173;
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      };

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      on("task", {
        log: (message) => {
          console.log(message);
          return null;
        },
      });

      return { ...config, ...configOverrides };
    },
  },
});

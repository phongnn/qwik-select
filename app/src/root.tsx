import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { Head } from "./components/head";

import "./global.css";

export default component$(() => {
  return (
    <QwikCityProvider>
      <Head />
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});

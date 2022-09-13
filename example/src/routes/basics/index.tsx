import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Select from "qwik-select";

export default component$(() => {
  return <Select />;
});

export const head: DocumentHead = {
  title: "Basic example",
};

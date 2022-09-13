import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { Counter } from "../components/counter";

export default component$(() => {
  return (
    <div>
      <h1>Welcome to Qwik City</h1>
      <Counter />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik City",
};

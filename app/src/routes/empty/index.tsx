import { component$, useStyles$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import originalStyles from "qwik-select/style.css";

import styles from "./styles.css";

export default component$(() => {
  useStyles$(originalStyles);
  useStyles$(styles);
  return (
    <div>
      <h1 class="text-xl">Empty state</h1>
      <ol>
        <li>
          <h2 class="text-lg pt-10">Default message</h2>
          <Select options={[]} />
        </li>
        <li class="custom">
          <h2 class="text-lg pt-10">Custom message</h2>
          <Select
            options={[]}
            placeholder="-- Select an option --"
            noOptionsMessage="No options available!!!"
          />
        </li>
      </ol>
    </div>
  );
});

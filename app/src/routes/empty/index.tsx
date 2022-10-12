import { component$, useStyles$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import styles from "qwik-select/style.css";

export default component$(() => {
  useStyles$(styles);
  return (
    <div>
      <Select options={[]} placeholder="-- Select an option --" />
    </div>
  );
});

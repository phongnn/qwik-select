import { component$, Slot, useStyles$ } from "@builder.io/qwik";

import styles from "./container.css?inline";

// export interface ContainerProps {
// }

// export const Container = component$((props: ContainerProps) => {
const Container = component$(() => {
  useStyles$(styles);

  return (
    <div class="container">
      <Slot />
    </div>
  );
});

export default Container;

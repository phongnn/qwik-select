import { component$, Ref, Slot, useStyles$ } from "@builder.io/qwik";

import styles from "./container.css?inline";

export interface ContainerProps {
  ref: Ref<HTMLElement>;
}

export const Container = component$((props: ContainerProps) => {
  useStyles$(styles);

  return (
    <div class="container" ref={props.ref}>
      <Slot />
    </div>
  );
});

export default Container;

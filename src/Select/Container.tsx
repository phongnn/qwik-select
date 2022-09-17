import { component$, Ref, Slot } from "@builder.io/qwik";

interface ContainerProps {
  ref: Ref<HTMLElement>;
}

export const Container = component$((props: ContainerProps) => {
  return (
    <div class="container" ref={props.ref}>
      <Slot />
    </div>
  );
});

export default Container;

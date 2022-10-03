import { component$, Ref, Slot } from "@builder.io/qwik";

interface ContainerProps {
  ref: Ref<HTMLElement>;
  disabled: boolean;
}

export const Container = component$((props: ContainerProps) => {
  return (
    <div
      class="qs-container"
      ref={props.ref}
      data-disabled={props.disabled.toString()}
    >
      <Slot />
    </div>
  );
});

export default Container;

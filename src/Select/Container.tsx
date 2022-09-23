import { component$, Ref, Slot } from "@builder.io/qwik";

interface ContainerProps {
  ref: Ref<HTMLElement>;
  disabled: boolean;
}

export const Container = component$((props: ContainerProps) => {
  const classes = `container ${props.disabled ? "disabled" : ""}`;
  return (
    <div class={classes} ref={props.ref}>
      <Slot />
    </div>
  );
});

export default Container;

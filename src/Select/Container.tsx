import { component$, Ref, Slot } from "@builder.io/qwik";

interface ContainerProps {
  ref: Ref<HTMLElement>;
  disabled?: boolean;
}

export const Container = component$((props: ContainerProps) => {
  const disabled = (props.disabled ?? false).toString();
  return (
    <div class="qs-container" ref={props.ref} data-disabled={disabled}>
      <Slot />
    </div>
  );
});

export default Container;

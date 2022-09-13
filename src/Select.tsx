import { component$ } from "@builder.io/qwik";

interface SelectProps {
  placeholder?: string;
}

const Select = component$((props: SelectProps) => {
  return <div>{props.placeholder || "Select..."}</div>;
});

export type { SelectProps };

export default Select;

import { component$, useStyles$ } from "@builder.io/qwik";

import Container from "./Container";
import Control from "./Control";

import styles from "./select.css?inline";

type SelectOption = string | { value: string; label: string };
interface SelectProps {
  placeholder?: string;
  options: SelectOption[];
  noOptionsMessage?: string;
}

const Select = component$((props: SelectProps) => {
  const placeholder = props.placeholder || "Select...";
  const noOptionsMessage = props.noOptionsMessage || "No options";
  const isEmpty = !props.options || props.options.length === 0;

  useStyles$(styles);

  return (
    <Container>
      <Control placeholder={placeholder} />
      {isEmpty && <div class="empty">{noOptionsMessage}</div>}
    </Container>
  );
});

export type { SelectProps, SelectOption };

export default Select;

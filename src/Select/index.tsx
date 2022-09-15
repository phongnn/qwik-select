import { component$, useStyles$ } from "@builder.io/qwik";

import type { SelectOption } from "../types";

import useSelect from "../useSelect";
import Container from "./Container";
import Control from "./Control";
import List from "./List";

import styles from "./select.css?inline";

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

  const { containerRef, state } = useSelect();
  return (
    <Container ref={containerRef}>
      <div>
        <Control placeholder={placeholder} />
        {state.isOpen && <List items={props.options} />}
        {isEmpty && <div class="empty">{noOptionsMessage}</div>}
      </div>
    </Container>
  );
});

export type { SelectProps, SelectOption };

export default Select;

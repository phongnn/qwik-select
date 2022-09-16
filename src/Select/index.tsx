import { component$, useStyles$ } from "@builder.io/qwik";

import type { SelectOption } from "../types";

import useSelect from "../useSelect";
import Container from "./Container";
import Control from "./Control";
import List from "./List";
import ListItem from "./ListItem";

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

  const { refs, state } = useSelect({
    options: props.options,
  });
  return (
    <Container ref={refs.containerRef}>
      <div>
        <Control placeholder={placeholder} ref={refs.inputRef} />
        {state.isOpen && (
          <List
            items={props.options}
            renderItem={(opt) => <ListItem data={opt} selectState={state} />}
          />
        )}
        {isEmpty && <div class="empty">{noOptionsMessage}</div>}
      </div>
    </Container>
  );
});

export type { SelectProps, SelectOption };

export default Select;

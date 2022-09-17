import { component$, useStyles$ } from "@builder.io/qwik";

import type { SelectOption } from "../types";

import useSelect, { UseSelectParams } from "../useSelect";
import Container from "./Container";
import Control from "./Control";
import ListItem from "./ListItem";

import styles from "./select.css?inline";

type SelectProps = UseSelectParams & {
  placeholder?: string;
  noOptionsMessage?: string;
  getOptionLabel?: (opt: SelectOption) => string;
};

export const defaultGetOptionLabel = (opt: SelectOption) => {
  return typeof opt === "string"
    ? opt
    : typeof opt === "object" && "label" in opt
    ? opt.label
    : opt.toString();
};

const Select = component$((props: SelectProps) => {
  const placeholder = props.placeholder || "Select...";
  const noOptionsMessage = props.noOptionsMessage || "No options";
  const isEmpty = !props.options || props.options.length === 0;
  const getOptionLabel = props.getOptionLabel || defaultGetOptionLabel;

  const { refs, stores } = useSelect(props);
  const { selectedOptionStore, hoveredOptionStore, isOpenStore } = stores;

  useStyles$(styles);

  return (
    <Container ref={refs.containerRef}>
      <div>
        <Control
          placeholder={placeholder}
          ref={refs.inputRef}
          selectedOptionStore={selectedOptionStore}
          getOptionLabel={getOptionLabel}
        />
        {isOpenStore.value && (
          <div class="list">
            {props.options.map((opt) => (
              <ListItem data={opt} hoveredOptionStore={hoveredOptionStore} />
            ))}
          </div>
        )}
        {isEmpty && <div class="empty">{noOptionsMessage}</div>}
      </div>
    </Container>
  );
});

export type { SelectProps, SelectOption };

export default Select;

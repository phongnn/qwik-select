// prettier-ignore
import { component$, useStyles$, mutable, $, PropFunction } from "@builder.io/qwik";

import type { SelectOption } from "../types";
import { useSelect } from "../useSelect";
import Container from "./Container";
import Control from "./Control";
import MenuItem from "./MenuItem";

import styles from "./select.css?inline";

interface SelectProps {
  options?: SelectOption[];
  fetchOptions$?: PropFunction<(text: string) => Promise<SelectOption[]>>;
  value?: SelectOption;
  onChange$?: PropFunction<(value: SelectOption | undefined) => void>;
  onClear$?: PropFunction<() => void>;
  onInput$?: PropFunction<(text: string) => any>;
  onFocus$?: PropFunction<() => any>;
  onBlur$?: PropFunction<() => any>;
  optionLabelKey?: string;
  inputDebounceTime?: number;
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
}

const Select = component$((props: SelectProps) => {
  const disabled = props.disabled ?? false;
  const placeholder = props.placeholder ?? "Select...";
  const noOptionsMessage = props.noOptionsMessage ?? "No options";
  const optionLabelKey = props.optionLabelKey ?? "label";
  const inputDebounceTime = props.inputDebounceTime ?? 200;

  // prettier-ignore
  const getOptionLabel = (opt: SelectOption) => typeof opt === "string" ? opt : opt[optionLabelKey];
  // prettier-ignore
  const selectedOptionLabel = props.value ? getOptionLabel(props.value) : undefined;

  const scrollToHoveredOption = $((menuElem?: HTMLElement) => {
    const element = menuElem?.querySelector("item.hover");
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  const { refs, state, actions } = useSelect({
    ...props,
    optionLabelKey,
    inputDebounceTime,
    scrollToHoveredOption,
  });

  useStyles$(styles);

  return (
    <Container ref={refs.containerRef} disabled={mutable(disabled)}>
      <div>
        <Control
          placeholder={placeholder}
          ref={refs.inputRef}
          selectedOptionLabel={mutable(selectedOptionLabel)}
          inputValue={mutable(state.inputValue)}
          loading={mutable(state.loading)}
          disabled={mutable(disabled)}
          onClear$={props.onClear$}
        />
        {state.isOpen && (
          <div class="menu" ref={refs.listRef}>
            {state.filteredOptions.map((opt) => {
              const isSelected = opt === props.value;
              const isHovered = opt === state.hoveredOption;
              return (
                <MenuItem
                  option={opt}
                  getOptionLabel={getOptionLabel}
                  isSelected={mutable(isSelected)}
                  isHovered={mutable(isHovered)}
                  onClick$={async () => {
                    if (props.onChange$ && opt !== props.value) {
                      props.onChange$(opt);
                    }
                    actions.blur();
                  }}
                />
              );
            })}
            {state.filteredOptions.length === 0 && (
              <div class="empty">{noOptionsMessage}</div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
});

export type { SelectProps, SelectOption };

export default Select;

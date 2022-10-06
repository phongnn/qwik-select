import { component$, mutable, $, PropFunction } from "@builder.io/qwik";

import type { OptionLabelKey } from "../useSelect";
import { useSelect } from "../useSelect";
import Container from "./Container";
import Control from "./Control";
import MenuItem from "./MenuItem";

interface SelectProps<Option> {
  options?: Option[];
  fetchOptions$?: PropFunction<(text: string) => Promise<Option[]>>;
  value?: Option;
  onChange$?: PropFunction<(value: Option) => any>;
  onClear$?: PropFunction<() => any>;
  onInput$?: PropFunction<(text: string) => any>;
  onFocus$?: PropFunction<() => any>;
  onBlur$?: PropFunction<() => any>;
  optionLabelKey?: OptionLabelKey<Option>;
  inputDebounceTime?: number;
  autofocus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
}

// NOTE: the weird <Option, > syntax is to avoid error as JSX and TypeScript syntaxes clash.
// We could use a normal function instead of an arrow function, but that would cause
// "props is undefined" error in MenuItem's click event.
const Select = component$(<Option,>(props: SelectProps<Option>) => {
  const disabled = props.disabled ?? false;
  const placeholder = props.placeholder ?? "Select...";
  const noOptionsMessage = props.noOptionsMessage ?? "No options";
  const optionLabelKey =
    props.optionLabelKey ?? ("label" as OptionLabelKey<Option>);
  const inputDebounceTime = props.inputDebounceTime ?? 200;

  // prettier-ignore
  const getOptionLabel = (opt: Option) => typeof opt === "string" ? opt : opt[optionLabelKey] as string;
  // prettier-ignore
  const selectedOptionLabel = props.value ? getOptionLabel(props.value) : undefined;

  const scrollToHoveredOption = $((menuElem?: HTMLElement) => {
    const element = menuElem?.querySelector('.qs-item[data-hovered="true"]');
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  const { refs, state, actions } = useSelect<Option>(props, {
    optionLabelKey,
    inputDebounceTime,
    scrollToHoveredOption,
  });

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
          autofocus={mutable(props.autofocus)}
          onClear$={props.onClear$}
        />
        {state.isOpen && (
          <div class="qs-menu" ref={refs.listRef}>
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
              <div class="qs-empty">{noOptionsMessage}</div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
});

export type { SelectProps };
export default Select;

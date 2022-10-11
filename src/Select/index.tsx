import { component$, mutable, $ } from "@builder.io/qwik";

import type { OptionLabelKey, UseSelectProps } from "../useSelect";
import { useSelect } from "../useSelect";
import Container from "./Container";
import SingleSelectControl from "./Control/SingleSelectControl";
import MultiSelectControl from "./Control/MultiSelectControl";
import MenuItem from "./MenuItem";

type SelectProps<Option> = UseSelectProps<Option> & {
  optionLabelKey?: OptionLabelKey<Option>;
  inputDebounceTime?: number;
  autofocus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  shouldFilterSelectedOptions?: boolean;
};

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
  const shouldFilterSelectedOptions = props.shouldFilterSelectedOptions ?? true;

  // prettier-ignore
  const getOptionLabel = (opt: Option) => typeof opt === "string" ? opt : opt[optionLabelKey] as string;
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
    shouldFilterSelectedOptions,
  });

  const handleOptionUnselect = $((opt: Option) => {
    if (props.onUnselect$ !== undefined) {
      props.onUnselect$(opt);
    }
    actions.blur();
  });

  const handleClear = $(() => {
    if (props.onClear$ !== undefined) {
      props.onClear$();
    }
    actions.blur();
  });

  const Control = Array.isArray(props.value)
    ? MultiSelectControl
    : SingleSelectControl;

  return (
    <Container ref={refs.containerRef} disabled={mutable(disabled)}>
      <div>
        <Control
          placeholder={placeholder}
          ref={refs.inputRef}
          value={mutable(props.value) as any}
          disabled={mutable(disabled)}
          autofocus={mutable(props.autofocus)}
          inputValue={mutable(state.inputValue)}
          loading={mutable(state.loading)}
          onUnselect$={handleOptionUnselect}
          onClear$={handleClear}
          optionLabelKey={optionLabelKey as any}
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
                    if (props.onChange$ !== undefined && opt !== props.value) {
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

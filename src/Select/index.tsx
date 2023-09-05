import { component$, $, useVisibleTask$ } from "@builder.io/qwik";

import type { OptionLabelKey, UseSelectProps } from "../useSelect";
import { useSelect } from "../useSelect";
import SingleSelectControl from "./SingleSelectControl";
import MultiSelectControl from "./MultiSelectControl";

type SelectProps<Option> = UseSelectProps<Option> & {
  placeholder?: string;
  autofocus?: boolean;
  disabled?: boolean;
  optionLabelKey?: OptionLabelKey<Option>;
  inputDebounceTime?: number;
  shouldFilterSelectedOptions?: boolean;
};

// NOTE: the weird <Option, > syntax is to avoid error as JSX and TypeScript syntaxes clash.
// We could use a normal function instead of an arrow function, but that would cause
// "props is undefined" error in MenuItem's click event.
const Select = component$(<Option,>(props: SelectProps<Option>) => {
  const placeholder = props.placeholder ?? "Select...";
  const disabled = (props.disabled ?? false).toString();
  const optionLabelKey =
    props.optionLabelKey ?? ("label" as OptionLabelKey<Option>);
  const inputDebounceTime = props.inputDebounceTime ?? 200;
  const shouldFilterSelectedOptions = props.shouldFilterSelectedOptions ?? true;

  // TODO: define a Slot for "No options"
  // 12-Oct-2022: slot fallback content doesn't work - seems like a bug in Qwik
  const noOptionsMessage = "No options";

  const { refs, stores, actions } = useSelect<Option>(props, {
    optionLabelKey,
    inputDebounceTime,
    shouldFilterSelectedOptions,
  });
  const { containerRef, inputRef, menuRef } = refs;
  // prettier-ignore
  const { isOpenStore, inputValueStore, filteredOptionsStore, hoveredOptionStore } = stores;

  useVisibleTask$(function scrollToHoveredOption({ track }) {
    const hoveredOption = track(() => hoveredOptionStore.hoveredOption);
    if (hoveredOption) {
      // prettier-ignore
      const itemEl = menuRef.value?.querySelector('.qs-item[data-hovered="true"]');
      itemEl?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  const handleOptionUnselect = $((opt: Option) => {
    if (props.onUnselect$) {
      props.onUnselect$(opt);
    }
    actions.blur();
  });

  const handleClear = $(() => {
    if (props.onClear$) {
      props.onClear$();
    }
    actions.blur();
  });

  const Control = Array.isArray(props.value)
    ? MultiSelectControl
    : SingleSelectControl;

  return (
    <div class="qs-container" ref={containerRef} data-disabled={disabled}>
      <Control
        placeholder={placeholder}
        ref={inputRef}
        value={props.value as any}
        disabled={props.disabled}
        autofocus={props.autofocus}
        inputValue={inputValueStore.value}
        loading={filteredOptionsStore.loading}
        clearable={!!props.onClear$}
        onUnselect$={handleOptionUnselect}
        onClear$={handleClear}
        optionLabelKey={optionLabelKey as any}
      />
      {isOpenStore.value === true && (
        <div class="qs-menu" ref={menuRef}>
          {filteredOptionsStore.options.map((opt) => {
            const isSelected = opt === props.value;
            const isHovered = opt === hoveredOptionStore.hoveredOption;
            // prettier-ignore
            const label = typeof opt === "string" ? opt : opt[optionLabelKey] as string;
            return (
              <div
                class="qs-item"
                data-selected={isSelected.toString()}
                data-hovered={isHovered.toString()}
                onClick$={async () => {
                  if (props.onSelect$ && opt !== props.value) {
                    props.onSelect$(opt);
                  }
                  actions.blur();
                }}
              >
                {label}
              </div>
            );
          })}
          {filteredOptionsStore.options.length === 0 && (
            <div class="qs-empty">{noOptionsMessage}</div>
          )}
        </div>
      )}
    </div>
  );
});

export type { SelectProps };
export default Select;

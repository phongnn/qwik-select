// prettier-ignore
import { PropFunction, Signal, component$, useSignal, useClientEffect$ } from "@builder.io/qwik";

import type { OptionLabelKey } from "../useSelect";
import ClearButton from "./ClearButton";
import LoadingIndicator from "./LoadingIndicator";

interface MultiSelectControlProps<Option> {
  ref: Signal<HTMLInputElement | undefined>;
  placeholder: string;
  value: Option[];
  inputValue: string;
  loading: boolean;
  disabled?: boolean;
  autofocus?: boolean;
  clearable: boolean;
  onUnselect$?: PropFunction<(opt: Option) => any>;
  onClear$?: PropFunction<() => any>;
  optionLabelKey?: OptionLabelKey<Option>;
}

const MultiSelectControl = component$(
  <Option,>(props: MultiSelectControlProps<Option>) => {
    const selectedOptions = props.value;
    const shouldShowLoading = props.loading;
    const hasValues = selectedOptions.length > 0;
    const shouldShowClearBtn =
      props.clearable && hasValues && !shouldShowLoading;

    return (
      <div class="qs-multi-control">
        <div style={{ display: "contents" }}>
          {selectedOptions.map((opt) => {
            // prettier-ignore
            const label = typeof opt === "string" ? opt : (opt[props.optionLabelKey!] as string);
            return (
              <MultiValue
                label={label}
                onClear$={() => {
                  if (props.onUnselect$) {
                    props.onUnselect$(opt);
                  }
                }}
              />
            );
          })}
        </div>

        <input
          type="text"
          ref={props.ref}
          value={props.inputValue}
          disabled={props.disabled}
          autoFocus={props.autofocus}
          placeholder={hasValues ? "" : props.placeholder}
        />

        {shouldShowClearBtn && <ClearButton onClick$={props.onClear$!} />}
        {shouldShowLoading && <LoadingIndicator />}
      </div>
    );
  }
);

export const MultiValue = component$(
  (props: { label: string; onClear$?: PropFunction<() => any> }) => {
    // we use synchronous event here to stop it from propagating
    // to the container which would toggle the menu
    const clearBtnRef = useSignal<HTMLElement>();
    useClientEffect$(() => {
      const handler = (event: Event) => {
        event.stopPropagation();
        if (props.onClear$) {
          props.onClear$();
        }
      };
      clearBtnRef.value!.addEventListener("click", handler);
      return () => clearBtnRef.value!.removeEventListener("click", handler);
    });

    return (
      <div class="qs-multi-value">
        <div class="qs-multi-value-label">{props.label}</div>
        <div class="qs-multi-value-clear" ref={clearBtnRef}>
          <svg
            width="100%"
            height="100%"
            viewBox="-2 -2 60 60"
            focusable="false"
            aria-hidden="true"
            role="presentation"
          >
            <path d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z" />
          </svg>
        </div>
      </div>
    );
  }
);

export default MultiSelectControl;

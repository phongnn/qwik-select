import { PropFunction, Ref, component$ } from "@builder.io/qwik";

import type { OptionLabelKey } from "../../useSelect";
import ClearButton from "./ClearButton";
import LoadingIndicator from "./LoadingIndicator";

interface SingleSelectControlProps<Option> {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
  value?: Option;
  inputValue: string;
  loading: boolean;
  disabled?: boolean;
  autofocus?: boolean;
  onClear$?: PropFunction<() => void>;
  optionLabelKey?: OptionLabelKey<Option>;
}

const SingleSelectControl = component$(
  <Option,>(props: SingleSelectControlProps<Option>) => {
    const selectedOption = props.value;
    const hasValue = !!selectedOption;
    const isBlankTextInput = props.inputValue === "";
    const hasClearHandler = !!props.onClear$;
    const shouldShowLoading = props.loading;
    const shouldShowValue = hasValue && isBlankTextInput;
    const shouldShowPlaceholder = !hasValue && isBlankTextInput;
    const shouldShowClearBtn = hasClearHandler && shouldShowValue;
    const label =
      selectedOption === undefined
        ? undefined
        : typeof selectedOption === "string"
        ? selectedOption
        : (selectedOption![props.optionLabelKey!] as string);

    return (
      <div class="qs-single-control">
        {shouldShowValue && <div class="qs-single-value">{label}</div>}
        {!shouldShowValue && (
          <div
            class="qs-placeholder"
            style={{ visibility: shouldShowPlaceholder ? "visible" : "hidden" }}
          >
            {props.placeholder}
          </div>
        )}

        <input
          type="text"
          ref={props.ref}
          value={props.inputValue}
          disabled={props.disabled}
          autoFocus={props.autofocus}
        />

        {shouldShowClearBtn && <ClearButton onClick$={props.onClear$!} />}
        {shouldShowLoading && <LoadingIndicator />}
      </div>
    );
  }
);

export default SingleSelectControl;

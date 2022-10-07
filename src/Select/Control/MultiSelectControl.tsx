import { MutableWrapper, PropFunction, Ref } from "@builder.io/qwik";

import ClearButton from "./ClearButton";
import LoadingIndicator from "./LoadingIndicator";

interface MultiSelectControlProps<Option> {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
  value: MutableWrapper<Option[]>;
  inputValue: MutableWrapper<string>;
  loading: MutableWrapper<boolean>;
  disabled: MutableWrapper<boolean>;
  autofocus: MutableWrapper<boolean | undefined>;
  onClear$?: PropFunction<() => void>;
  getOptionLabel: (opt: Option) => string;
}

const MultiSelectControl = <Option,>(
  props: MultiSelectControlProps<Option>
) => {
  const selectedOptions = props.value.mut;
  const isBlankTextInput = props.inputValue.mut === "";
  const shouldShowLoading = props.loading.mut;
  const hasClearHandler = props.onClear$ !== undefined;
  const hasValues = selectedOptions.length > 0;
  const shouldShowClearBtn = hasClearHandler && hasValues;

  return (
    <div>
      {selectedOptions.map((opt) => (
        <MultiValue label={props.getOptionLabel(opt)} />
      ))}
      {!hasValues && (
        <div
          class="qs-placeholder"
          style={{ visibility: isBlankTextInput ? "visible" : "hidden" }}
        >
          {props.placeholder}
        </div>
      )}

      <input
        type="text"
        ref={props.ref}
        value={props.inputValue.mut}
        disabled={props.disabled.mut}
        autoFocus={props.autofocus.mut}
      />

      {shouldShowClearBtn && <ClearButton onClick$={props.onClear$!} />}
      {shouldShowLoading && <LoadingIndicator />}
    </div>
  );
};

const MultiValue = (props: { label: string }) => {
  return (
    <div class="qs-multi-value">
      <div class="qs-multi-value-label">{props.label}</div>
      <div class="qs-multi-value-clear">
        <svg
          width="100%"
          height="100%"
          viewBox="-2 -2 50 50"
          focusable="false"
          aria-hidden="true"
          role="presentation"
        >
          <path d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z" />
        </svg>
      </div>
    </div>
  );
};

export default MultiSelectControl;

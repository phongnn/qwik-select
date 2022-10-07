import { MutableWrapper, PropFunction, Ref } from "@builder.io/qwik";

import ClearButton from "./ClearButton";
import LoadingIndicator from "./LoadingIndicator";

interface SingleSelectControlProps<Option> {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
  value: MutableWrapper<Option | undefined>;
  inputValue: MutableWrapper<string>;
  loading: MutableWrapper<boolean>;
  disabled: MutableWrapper<boolean>;
  autofocus: MutableWrapper<boolean | undefined>;
  onClear$?: PropFunction<() => void>;
  getOptionLabel: (opt: Option) => string;
}

const SingleSelectControl = <Option,>(
  props: SingleSelectControlProps<Option>
) => {
  const selectedOption = props.value.mut;
  const hasValue = selectedOption !== undefined;
  const isBlankTextInput = props.inputValue.mut === "";
  const hasClearHandler = props.onClear$ !== undefined;
  const shouldShowLoading = props.loading.mut;
  const shouldShowValue = hasValue && isBlankTextInput;
  const shouldShowPlaceholder = !hasValue && isBlankTextInput;
  const shouldShowClearBtn = hasClearHandler && shouldShowValue;

  return (
    <div>
      {shouldShowValue && (
        <div class="qs-single-value">
          {props.getOptionLabel(selectedOption)}
        </div>
      )}
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
        value={props.inputValue.mut}
        disabled={props.disabled.mut}
        autoFocus={props.autofocus.mut}
      />

      {shouldShowClearBtn && <ClearButton onClick$={props.onClear$!} />}
      {shouldShowLoading && <LoadingIndicator />}
    </div>
  );
};

export default SingleSelectControl;

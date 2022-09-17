import { Ref } from "@builder.io/qwik";

import { SelectOption } from "../types";

interface ControlProps {
  ref: Ref<HTMLInputElement>;
  selectedOptionStore: {
    value?: SelectOption;
  };
  placeholder: string;
  getOptionLabel: (opt: SelectOption) => string;
}

const Control = (props: ControlProps) => {
  const selectedOptionLabel = props.selectedOptionStore.value
    ? props.getOptionLabel(props.selectedOptionStore.value)
    : undefined;

  return (
    <div>
      <input
        type="text"
        placeholder={props.placeholder}
        ref={props.ref}
        value={selectedOptionLabel}
      />
    </div>
  );
};

export default Control;

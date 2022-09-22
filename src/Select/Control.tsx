import { MutableWrapper, Ref } from "@builder.io/qwik";

interface ControlProps {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
  selectedOptionLabel: MutableWrapper<string | undefined>;
  inputValue: MutableWrapper<string>;
}

const Control = (props: ControlProps) => {
  return (
    <div>
      <div
        class="selected-item-label"
        style={{ visibility: props.inputValue.v ? "hidden" : "visible" }}
      >
        {props.selectedOptionLabel.v || props.placeholder}
      </div>
      <input type="text" ref={props.ref} value={props.inputValue.v} />
    </div>
  );
};

export default Control;

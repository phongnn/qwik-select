import { MutableWrapper, Ref } from "@builder.io/qwik";

interface ControlProps {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
  value?: MutableWrapper<string>;
}

const Control = (props: ControlProps) => {
  return (
    <div>
      <input
        type="text"
        placeholder={props.placeholder}
        ref={props.ref}
        value={props.value?.v}
      />
    </div>
  );
};

export default Control;

import { component$, useStyles$, Ref } from "@builder.io/qwik";

import styles from "./input.css?inline";
export interface ControlProps {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
}

const Control = component$((props: ControlProps) => {
  useStyles$(styles);
  return (
    <div>
      <input type="text" placeholder={props.placeholder} ref={props.ref} />
    </div>
  );
});

export default Control;

// type ControlProps = Omit<CommonProps, "class"> &
//   Pick<
//     SelectReturn,
//     | "value"
//     | "hasValue"
//     | "setValue"
//     | "multiple"
//     | "disabled"
//     | "inputValue"
//     | "inputRef"
//   >;

// const Control = (props: ControlProps) => {
//   const removeValue = (index: number) => {
//     const value = props.value;
//     props.setValue([...value.slice(0, index), ...value.slice(index + 1)]);
//   };

//   return (
//     <div
//       class="solid-select-control"
//       data-multiple={props.multiple}
//       data-has-value={props.hasValue}
//       data-disabled={props.disabled}
//     >
//       <Show when={!props.hasValue && !props.inputValue}>
//         <Placeholder>{props.placeholder}</Placeholder>
//       </Show>
//       <Show when={props.hasValue && !props.multiple && !props.inputValue}>
//         <SingleValue>{props.format(props.value, "value")}</SingleValue>
//       </Show>
//       <Show when={props.hasValue && props.multiple}>
//         <For each={props.value}>
//           {(value, index) => (
//             <MultiValue onRemove={() => removeValue(index())}>
//               {props.format(value, "value")}
//             </MultiValue>
//           )}
//         </For>
//       </Show>
//       <Input
//         ref={props.inputRef}
//         id={props.id}
//         name={props.name}
//         autofocus={props.autofocus}
//         disabled={props.disabled}
//         readonly={props.readonly}
//       />
//     </div>
//   );
// };

// type PlaceholderProps = Pick<CommonProps, "placeholder">;

// const Placeholder: Component<PlaceholderProps> = (props) => {
//   return <div class="solid-select-placeholder">{props.children}</div>;
// };

// const SingleValue: Component<{}> = (props) => {
//   return <div class="solid-select-single-value">{props.children}</div>;
// };

// const MultiValue: Component<{ onRemove: () => void }> = (props) => {
//   return (
//     <div class="solid-select-multi-value">
//       {props.children}
//       <button
//         type="button"
//         class="solid-select-multi-value-remove"
//         on:click={(event: MouseEvent) => {
//           event.stopPropagation();
//           props.onRemove();
//         }}
//       >
//         ⨯
//       </button>
//     </div>
//   );
// };

// type InputProps = {
//   ref: SelectReturn["inputRef"];
//   disabled: SelectReturn["disabled"];
// } & Pick<CommonProps, "id" | "name" | "autofocus" | "readonly">;

// const Input: Component<InputProps> = (props) => {
//   return (
//     <input
//       ref={props.ref}
//       id={props.id}
//       name={props.name}
//       class="solid-select-input"
//       type="text"
//       tabIndex={0}
//       autocomplete="off"
//       autocapitalize="none"
//       autofocus={props.autofocus}
//       readonly={props.readonly}
//       disabled={props.disabled}
//       size={1}
//       onKeyDown={(event: KeyboardEvent) => {
//         if (event.key === "Escape") {
//           event.preventDefault();
//           event.stopPropagation();
//           (event.target as HTMLElement).blur();
//         }
//       }}
//     />
//   );
// };

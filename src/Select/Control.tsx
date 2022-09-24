import {
  MutableWrapper,
  PropFunction,
  Ref,
  component$,
  useClientEffect$,
  useRef,
} from "@builder.io/qwik";

interface ControlProps {
  ref: Ref<HTMLInputElement>;
  placeholder: string;
  selectedOptionLabel: MutableWrapper<string | undefined>;
  inputValue: MutableWrapper<string>;
  disabled: MutableWrapper<boolean>;
  onClear$?: PropFunction<() => void>;
}

const Control = (props: ControlProps) => {
  const clearable = props.selectedOptionLabel.mut && props.onClear$;
  return (
    <div>
      <div
        class="selected-item-label"
        style={{ visibility: props.inputValue.mut ? "hidden" : "visible" }}
      >
        {props.selectedOptionLabel.mut || props.placeholder}
      </div>
      <input
        type="text"
        ref={props.ref}
        value={props.inputValue.mut}
        disabled={props.disabled.mut}
      />
      {clearable && <ClearButton onClick$={props.onClear$!} />}
    </div>
  );
};

const ClearButton = component$(
  (props: { onClick$: PropFunction<() => void> }) => {
    // we use synchronous event here to stop it from propagating
    // to the container which would open the menu
    const ref = useRef<HTMLElement>();
    useClientEffect$(() => {
      const handler = (event: Event) => {
        event.stopPropagation();
        props.onClick$();
      };
      ref.current!.addEventListener("click", handler);
      return () => ref.current!.removeEventListener("click", handler);
    });

    return (
      <div class="clear-button" ref={ref} data-testid="qwik-select-clear">
        <svg
          width="100%"
          height="100%"
          viewBox="-2 -2 50 50"
          focusable="false"
          aria-hidden="true"
          role="presentation"
        >
          <path
            fill="currentColor"
            d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"
          />
        </svg>
      </div>
    );
  }
);

export default Control;

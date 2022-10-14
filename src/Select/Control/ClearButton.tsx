// prettier-ignore
import { component$, PropFunction, useClientEffect$, useSignal } from "@builder.io/qwik";

const ClearButton = component$(
  (props: { onClick$: PropFunction<() => any> }) => {
    // we use synchronous event here to stop it from propagating
    // to the container which would toggle the menu
    const ref = useSignal<HTMLElement>();
    useClientEffect$(() => {
      const handler = (event: Event) => {
        event.stopPropagation();
        props.onClick$();
      };
      ref.value!.addEventListener("click", handler);
      return () => ref.value!.removeEventListener("click", handler);
    });

    return (
      <div class="qs-clear-button" ref={ref}>
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

export default ClearButton;

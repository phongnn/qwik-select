import { useRef, useClientEffect$, useStore, $ } from "@builder.io/qwik";

export default function useSelect() {
  const state = useStore({ isOpen: false });
  const containerRef = useRef<HTMLElement>();

  const toggle = $(() => (state.isOpen = !state.isOpen));

  useClientEffect$(() => {
    containerRef.current?.addEventListener("click", toggle);
    return () => {
      containerRef.current?.removeEventListener("click", toggle);
    };
  });

  return {
    state,
    containerRef,
  };
}

import {
  useRef,
  useClientEffect$,
  useStore,
  $,
  useWatch$,
} from "@builder.io/qwik";
import { SelectOption } from "./types";

interface UseSelectParams {
  options: SelectOption[];
}

export default function useSelect({ options }: UseSelectParams) {
  const state = useStore({ isOpen: false, hoveredOptionIndex: -1 });
  const containerRef = useRef<HTMLElement>();

  const hoveredOption = options[state.hoveredOptionIndex];
  const isOptionHovered = (option: SelectOption) => option === hoveredOption;

  const toggle = $(() => (state.isOpen = !state.isOpen));

  useClientEffect$(() => {
    containerRef.current?.addEventListener("click", toggle);
    return () => {
      containerRef.current?.removeEventListener("click", toggle);
    };
  });

  useWatch$(({ track }) => {
    track(state, "isOpen");
    if (state.isOpen) {
      state.hoveredOptionIndex = 0;
    }
  });

  return {
    state: {
      isOpen: state.isOpen,
    },
    containerRef,
    isOptionHovered,
  };
}

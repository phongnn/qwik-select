import {
  useRef,
  useClientEffect$,
  useStore,
  $,
  useWatch$,
} from "@builder.io/qwik";
import { SelectOption, SelectState } from "./types";

interface UseSelectParams {
  options: SelectOption[];
}

export default function useSelect({ options }: UseSelectParams) {
  const internalState = useStore({ options, hoveredOptionIndex: -1 });
  const state = useStore<SelectState>({ isOpen: false });
  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();

  const toggle = $(() => (state.isOpen = !state.isOpen));

  const clearHoveredOption = $(() => (internalState.hoveredOptionIndex = -1));
  const hoverFirstOption = $(() => (internalState.hoveredOptionIndex = 0));
  const hoverOption = $((direction: "next" | "previous") => {
    const max = internalState.options.length - 1;
    const delta = direction === "next" ? 1 : -1;
    let index = internalState.hoveredOptionIndex + delta;
    if (index > max) {
      index = 0;
    } else if (index < 0) {
      index = max;
    }
    internalState.hoveredOptionIndex = index;
  });

  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      hoverOption("next");
    } else if (event.key === "ArrowUp") {
      hoverOption("previous");
    }
  });

  useClientEffect$(() => {
    containerRef.current?.addEventListener("click", toggle);
    inputRef.current?.addEventListener("keydown", handleKeyDown);
    return () => {
      containerRef.current?.removeEventListener("click", toggle);
      inputRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  });

  useWatch$(function updateHoveredOptionOnListToggle({ track }) {
    track(state, "isOpen");
    if (state.isOpen) {
      hoverFirstOption();
    } else {
      clearHoveredOption();
    }
  });

  useWatch$(function computeHoveredOption({ track }) {
    const idx = track(internalState, "hoveredOptionIndex");
    state.hoveredOption = idx >= 0 ? internalState.options[idx] : undefined;
  });

  return {
    state,
    refs: {
      containerRef,
      inputRef,
    },
  };
}

import {
  useRef,
  useClientEffect$,
  useStore,
  $,
  useWatch$,
  PropFunction,
} from "@builder.io/qwik";

import { SelectOption } from "./types";

export interface UseSelectParams {
  options: SelectOption[];
  initialValue?: SelectOption;
  onChange$?: PropFunction<(value: SelectOption | undefined) => void>;
}

export default function useSelect({
  options,
  initialValue,
  onChange$,
}: UseSelectParams) {
  const internalState = useStore({
    options,
    hoveredOptionIndex: -1,
    onChange$,
  });

  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();

  const isOpenStore = useStore({ value: false });
  const selectedOptionStore = useStore<{ value?: SelectOption }>({
    value: initialValue,
  });
  const hoveredOptionStore = useStore<{ value?: SelectOption }>({});

  const toggleMenu = $(() => (isOpenStore.value = !isOpenStore.value));

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

  const setSelectedOption = $((opt: SelectOption) => {
    if (selectedOptionStore.value !== opt) {
      selectedOptionStore.value = opt;
      if (internalState.onChange$) {
        internalState.onChange$(opt);
      }
    }
    isOpenStore.value = false;
  });

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      hoverOption("next");
    } else if (event.key === "ArrowUp") {
      hoverOption("previous");
    } else if (event.key === "Enter" || event.key === "Tab") {
      if (hoveredOptionStore.value) {
        setSelectedOption(hoveredOptionStore.value);
      }
    }
  });

  useClientEffect$(() => {
    containerRef.current?.addEventListener("click", toggleMenu);
    inputRef.current?.addEventListener("keydown", handleKeyDown);
    return () => {
      containerRef.current?.removeEventListener("click", toggleMenu);
      inputRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  });

  useWatch$(function updateHoveredOptionOnListToggle({ track }) {
    track(isOpenStore, "value");
    if (isOpenStore.value) {
      hoverFirstOption();
    } else {
      clearHoveredOption();
    }
  });

  useWatch$(function computeHoveredOption({ track }) {
    const idx = track(internalState, "hoveredOptionIndex");
    hoveredOptionStore.value =
      idx >= 0 ? internalState.options[idx] : undefined;
  });

  // useWatch$(function triggerOnChange({ track }) {
  //   const val = track(value, "current");
  //   if (internalState.onChange$) {
  //     internalState.onChange$(val);
  //   }
  // });

  return {
    refs: {
      containerRef,
      inputRef,
    },
    stores: {
      isOpenStore,
      selectedOptionStore,
      hoveredOptionStore,
    },
  };
}

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

function useIsOpenStore() {
  const isOpenStore = useStore({ value: false });
  const toggleMenu = $(() => (isOpenStore.value = !isOpenStore.value));
  const closeMenu = $(() => (isOpenStore.value = false));
  const actions = { toggleMenu, closeMenu };
  return { isOpenStore, actions };
}

function useHoveredOptionStore(props: UseSelectParams) {
  const state = useStore({ hoveredOptionIndex: -1 });
  const hoveredOptionStore = useStore<{ value?: SelectOption }>({});

  useWatch$(function computeHoveredOption({ track }) {
    const idx = track(state, "hoveredOptionIndex");
    hoveredOptionStore.value = idx >= 0 ? props.options[idx] : undefined;
  });

  const clearHoveredOption = $(() => (state.hoveredOptionIndex = -1));
  const hoverFirstOption = $(() => (state.hoveredOptionIndex = 0));
  const hoverOption = $((direction: "next" | "previous") => {
    const max = props.options.length - 1;
    const delta = direction === "next" ? 1 : -1;
    let index = state.hoveredOptionIndex + delta;
    if (index > max) {
      index = 0;
    } else if (index < 0) {
      index = max;
    }
    state.hoveredOptionIndex = index;
  });

  const actions = { hoverFirstOption, hoverOption, clearHoveredOption };
  return { hoveredOptionStore, actions };
}

function useSelectedOptionStore(props: UseSelectParams) {
  const selectedOptionStore = useStore<{ value?: SelectOption }>({
    value: props.initialValue,
  });

  const setSelectedOption = $((opt: SelectOption) => {
    if (selectedOptionStore.value !== opt) {
      selectedOptionStore.value = opt;
      if (props.onChange$) {
        props.onChange$(opt);
      }
    }
  });

  // useWatch$(function triggerOnChange({ track }) {
  //   const val = track(selectedOptionStore, "value");
  //   if (props.onChange$) {
  //     props.onChange$(val);
  //   }
  // });

  return { selectedOptionStore, actions: { setSelectedOption } };
}

export default function useSelect(props: UseSelectParams) {
  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();

  const {
    hoveredOptionStore,
    actions: { hoverOption, hoverFirstOption, clearHoveredOption },
  } = useHoveredOptionStore(props);

  const {
    isOpenStore,
    actions: { toggleMenu, closeMenu },
  } = useIsOpenStore();

  const {
    selectedOptionStore,
    actions: { setSelectedOption },
  } = useSelectedOptionStore(props);

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      hoverOption("next");
    } else if (event.key === "ArrowUp") {
      hoverOption("previous");
    } else if (event.key === "Enter" || event.key === "Tab") {
      if (hoveredOptionStore.value) {
        setSelectedOption(hoveredOptionStore.value);
        closeMenu();
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

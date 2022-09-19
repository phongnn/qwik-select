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
  const openMenu = $(() => (isOpenStore.value = true));
  const closeMenu = $(() => (isOpenStore.value = false));
  const actions = { toggleMenu, openMenu, closeMenu };
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
    if (state.hoveredOptionIndex < 0) {
      return;
    }

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

  const selectOption = $((opt: SelectOption) => {
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

  return { selectedOptionStore, actions: { selectOption } };
}

export default function useSelect(props: UseSelectParams) {
  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();
  const listRef = useRef<HTMLElement>();

  const {
    hoveredOptionStore,
    actions: { hoverOption, hoverFirstOption, clearHoveredOption },
  } = useHoveredOptionStore(props);

  const {
    isOpenStore,
    actions: { toggleMenu, openMenu, closeMenu },
  } = useIsOpenStore();

  const {
    selectedOptionStore,
    actions: { selectOption },
  } = useSelectedOptionStore(props);

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      if (isOpenStore.value) {
        hoverOption("next");
      } else {
        openMenu();
      }
    } else if (event.key === "ArrowUp") {
      hoverOption("previous");
    } else if (event.key === "Enter" || event.key === "Tab") {
      if (hoveredOptionStore.value) {
        selectOption(hoveredOptionStore.value);
        closeMenu();
      }
    } else if (event.key === "Escape") {
      closeMenu();
    }
  });

  // const handleFocusOut = $((e: FocusEvent) => {
  //   debugger;
  //   // console.log("inside focus out.....");
  //   // const target = e.relatedTarget as HTMLElement;
  //   // if (listRef.current?.contains(target)) {
  //   //   e.preventDefault();
  //   //   e.stopPropagation();
  //   //   return;
  //   // }

  //   closeMenu();
  // });

  useClientEffect$(() => {
    containerRef.current?.addEventListener("click", toggleMenu);
    // containerRef.current?.addEventListener("focusout", handleFocusOut);

    inputRef.current?.addEventListener("keydown", handleKeyDown);

    return () => {
      containerRef.current?.removeEventListener("click", toggleMenu);
      // containerRef.current?.removeEventListener("focusout", handleFocusOut);

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
      listRef,
    },
    state: {
      isOpen: isOpenStore.value,
      value: selectedOptionStore.value,
      hoveredOption: hoveredOptionStore.value,
    },
    actions: {
      selectOption,
    },
    // stores: {
    //   isOpenStore,
    //   selectedOptionStore,
    //   hoveredOptionStore,
    // },
  };
}

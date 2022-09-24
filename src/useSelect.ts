import {
  useRef,
  useClientEffect$,
  useStore,
  $,
  useWatch$,
} from "@builder.io/qwik";

import { SelectOption, SelectProps } from "./types";

// interface UseSelectParams {
//   options: SelectOption[];
//   value?: SelectOption;
//   onChange$?: PropFunction<(value: SelectOption | undefined) => void>;
//   optionLabelKey: string;
// }

interface HoveredOptionStore {
  hoveredOptionIndex: number;
  hoveredOption?: SelectOption;
}

export function scrollToItem(
  listElem: HTMLElement | undefined,
  selector: string
) {
  const itemElement = listElem?.querySelector(selector);
  itemElement?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function useIsOpenStore() {
  const isOpenStore = useStore({ value: false });
  const toggleMenu = $(() => (isOpenStore.value = !isOpenStore.value));
  const openMenu = $(() => (isOpenStore.value = true));
  const closeMenu = $(() => (isOpenStore.value = false));
  const actions = { toggleMenu, openMenu, closeMenu };
  return { isOpenStore, actions };
}

function useHoveredOptionStore(filteredOptionsStore: {
  value: SelectOption[];
}) {
  const state = useStore<HoveredOptionStore>({ hoveredOptionIndex: -1 });

  const clearHoveredOption = $(() => {
    state.hoveredOptionIndex = -1;
    state.hoveredOption = undefined;
  });

  const hoverOption = $((opt: SelectOption) => {
    state.hoveredOptionIndex = filteredOptionsStore.value.indexOf(opt);
    state.hoveredOption = opt;
  });

  const hoverFirstOption = $(() => {
    state.hoveredOptionIndex = 0;
    state.hoveredOption = filteredOptionsStore.value[0];
  });

  const hoverNextOption = $(() => {
    if (state.hoveredOptionIndex >= 0) {
      let index = state.hoveredOptionIndex + 1;
      if (index > filteredOptionsStore.value.length - 1) {
        index = 0;
      }
      state.hoveredOptionIndex = index;
      state.hoveredOption = filteredOptionsStore.value[index];
    }
  });
  const hoverPrevOption = $(() => {
    if (state.hoveredOptionIndex >= 0) {
      let index = state.hoveredOptionIndex - 1;
      if (index < 0) {
        index = filteredOptionsStore.value.length - 1;
      }
      state.hoveredOptionIndex = index;
      state.hoveredOption = filteredOptionsStore.value[index];
    }
  });

  const actions = {
    hoverFirstOption,
    hoverNextOption,
    hoverPrevOption,
    clearHoveredOption,
    hoverOption,
  };
  return { hoveredOptionStore: state, actions };
}

function useFilteredOptionsStore(
  options: SelectOption[],
  optionLabelKey: string
) {
  const state = useStore({ value: options });

  const filterOptions = $((query: string) => {
    if (query === "") {
      state.value = options;
    } else {
      state.value = options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : (opt[optionLabelKey] as string);
        return label.toLowerCase().includes(query.toLowerCase());
      });
    }
  });

  const clearFilter = $(() => (state.value = options));

  return {
    filteredOptionsStore: state,
    actions: { filterOptions, clearFilter },
  };
}

function useInputValueStore() {
  const state = useStore({ value: "" });
  const setInputValue = $((val: string) => (state.value = val));
  const clearInputValue = $(() => (state.value = ""));
  return {
    inputValueStore: state,
    actions: { setInputValue, clearInputValue },
  };
}

export function useSelect(
  props: SelectProps,
  config: { optionLabelKey: string }
) {
  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();
  const listRef = useRef<HTMLElement>();

  const {
    isOpenStore,
    actions: { toggleMenu, openMenu, closeMenu },
  } = useIsOpenStore();

  const {
    filteredOptionsStore,
    actions: { filterOptions, clearFilter },
  } = useFilteredOptionsStore(props.options, config.optionLabelKey);

  const {
    hoveredOptionStore,
    actions: {
      hoverOption,
      hoverFirstOption,
      hoverNextOption,
      hoverPrevOption,
      clearHoveredOption,
    },
  } = useHoveredOptionStore(filteredOptionsStore);

  const {
    inputValueStore,
    actions: { setInputValue, clearInputValue },
  } = useInputValueStore();

  const handleContainerClick = $((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!listRef.current?.contains(target)) {
      inputRef.current?.focus();
      toggleMenu();
    }
  });

  const handleInputKeyDown = $((event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (isOpenStore.value) {
        hoverNextOption();
      } else {
        openMenu();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      hoverPrevOption();
    } else if (event.key === "Enter" || event.key === "Tab") {
      if (hoveredOptionStore.hoveredOption) {
        closeMenu();
        if (props.onChange$) {
          props.onChange$(hoveredOptionStore.hoveredOption);
        }
      }
    } else if (event.key === "Escape") {
      closeMenu();
    }
  });

  const handleInputChange = $((event: Event) => {
    if (!isOpenStore.value) {
      openMenu();
    }

    const value = (event.target as HTMLInputElement).value;
    setInputValue(value);
    filterOptions(value);

    // update hovered option
    if (props.value && filteredOptionsStore.value.includes(props.value)) {
      hoverOption(props.value);
    } else if (filteredOptionsStore.value.length > 0) {
      hoverFirstOption();
    }
  });

  const handleContainerPointerDown = $((event: PointerEvent) => {
    // avoid triggering "focusout" event when user clicks on a menu item
    // otherwise the item's click event won't fire
    if (event.target !== inputRef.current) {
      event.preventDefault();
    }
  });

  useClientEffect$(() => {
    // prettier-ignore
    containerRef.current?.addEventListener("click", handleContainerClick);
    // prettier-ignore
    containerRef.current?.addEventListener("pointerdown", handleContainerPointerDown);

    inputRef.current?.addEventListener("keydown", handleInputKeyDown);
    inputRef.current?.addEventListener("input", handleInputChange);
    inputRef.current?.addEventListener("focusout", closeMenu);

    return () => {
      containerRef.current?.removeEventListener("click", handleContainerClick);
      // prettier-ignore
      containerRef.current?.removeEventListener("pointerdown", handleContainerPointerDown);

      inputRef.current?.removeEventListener("keydown", handleInputKeyDown);
      inputRef.current?.removeEventListener("input", handleInputChange);
      inputRef.current?.removeEventListener("focusout", closeMenu);
    };
  });

  useWatch$(function updateHoveredOptionOnListToggle({ track }) {
    const isOpen = track(isOpenStore, "value");
    if (isOpen) {
      if (props.value) {
        hoverOption(props.value);
      } else {
        hoverFirstOption();
      }
    } else {
      clearHoveredOption();
      clearInputValue();
      clearFilter();
    }
  });

  useWatch$(function scrollToSelectedOption({ track }) {
    // scroll to the selected option whenever the list is created
    // (i.e. whenever the menu is opened)
    const elem = track(listRef, "current");
    if (!!elem && !!props.value) {
      scrollToItem(elem, ".item.selected");
    }
  });

  useWatch$(function scrollToHoveredOption({ track }) {
    const hoveredOption = track(hoveredOptionStore, "hoveredOption");
    if (hoveredOption) {
      scrollToItem(listRef.current, ".item.hover");
    }
  });

  const blur = $(() => {
    inputRef.current?.blur();
  });

  return {
    refs: {
      containerRef,
      inputRef,
      listRef,
    },
    state: {
      isOpen: isOpenStore.value,
      hoveredOption: hoveredOptionStore.hoveredOption,
      filteredOptions: filteredOptionsStore.value,
      inputValue: inputValueStore.value,
    },
    actions: { blur },
  };
}

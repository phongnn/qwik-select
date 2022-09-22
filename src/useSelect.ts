import {
  useRef,
  useClientEffect$,
  useStore,
  $,
  useWatch$,
  PropFunction,
} from "@builder.io/qwik";

import { SelectOption } from "./types";

interface UseSelectParams {
  options: SelectOption[];
  value?: SelectOption;
  onChange$?: PropFunction<(value: SelectOption | undefined) => void>;
  optionLabelKey: string;
}

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

function useHoveredOptionStore(props: UseSelectParams) {
  const state = useStore<HoveredOptionStore>({ hoveredOptionIndex: -1 });

  const clearHoveredOption = $(() => {
    state.hoveredOptionIndex = -1;
    state.hoveredOption = undefined;
  });

  const hoverOption = $((opt: SelectOption) => {
    state.hoveredOptionIndex = props.options.indexOf(opt);
    state.hoveredOption = opt;
  });

  const hoverFirstOption = $(() => {
    state.hoveredOptionIndex = 0;
    state.hoveredOption = props.options[0];
  });

  const hoverNextOption = $(() => {
    if (state.hoveredOptionIndex >= 0) {
      let index = state.hoveredOptionIndex + 1;
      if (index > props.options.length - 1) {
        index = 0;
      }
      state.hoveredOptionIndex = index;
      state.hoveredOption = props.options[index];
    }
  });
  const hoverPrevOption = $(() => {
    if (state.hoveredOptionIndex >= 0) {
      let index = state.hoveredOptionIndex - 1;
      if (index < 0) {
        index = props.options.length - 1;
      }
      state.hoveredOptionIndex = index;
      state.hoveredOption = props.options[index];
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

function useFilteredOptionsStore(props: UseSelectParams) {
  const state = useStore({ value: props.options });

  const filter = $(async (query: string) => {
    if (query === "") {
      state.value = props.options;
    } else {
      state.value = props.options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : (opt[props.optionLabelKey] as string);
        return label.toLowerCase().includes(query.toLowerCase());
      });
    }
  });

  const actions = {
    filter,
  };
  return { filteredOptionsStore: state, actions };
}

export default function useSelect(props: UseSelectParams) {
  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();
  const listRef = useRef<HTMLElement>();

  // propsStore is needed as otherwise we will get an error
  // "props is not defined" in event handlers
  const propsStore = useStore({ ...props });

  const {
    hoveredOptionStore,
    actions: {
      hoverOption,
      hoverFirstOption,
      hoverNextOption,
      hoverPrevOption,
      clearHoveredOption,
    },
  } = useHoveredOptionStore(props);

  const {
    isOpenStore,
    actions: { toggleMenu, openMenu, closeMenu },
  } = useIsOpenStore();

  const {
    filteredOptionsStore,
    actions: { filter },
  } = useFilteredOptionsStore(props);

  const handleContainerClick = $(() => {
    inputRef.current?.focus();
    toggleMenu();
  });

  const handleInputKeyDown = $((event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      if (isOpenStore.value) {
        hoverNextOption();
      } else {
        openMenu();
      }
    } else if (event.key === "ArrowUp") {
      hoverPrevOption();
    } else if (event.key === "Enter" || event.key === "Tab") {
      if (hoveredOptionStore.hoveredOption) {
        closeMenu();
        if (propsStore.onChange$) {
          propsStore.onChange$(hoveredOptionStore.hoveredOption);
        }
      }
    } else if (event.key === "Escape") {
      closeMenu();
    }
  });

  const handleInputChange = $((event: Event) => {
    filter((event.target as HTMLInputElement).value);
  });

  const handleContainerPointerDown = $((event: PointerEvent) => {
    // avoid triggering "focusout" event when user clicks on a menu item
    // otherwise the item's click event won't fire
    if (event.target !== inputRef.current) {
      event.preventDefault();
    }
  });

  useClientEffect$(() => {
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
      if (propsStore.value) {
        hoverOption(propsStore.value);
      } else {
        hoverFirstOption();
      }
    } else {
      clearHoveredOption();
    }
  });

  useWatch$(function scrollToSelectedOption({ track }) {
    // scroll to the selected option whenever the list is created
    // (i.e. whenever the menu is opened)
    const elem = track(listRef, "current");
    if (!!elem && !!propsStore.value) {
      scrollToItem(elem, ".item.selected");
    }
  });

  useWatch$(function scrollToHoveredOption({ track }) {
    const hoveredOption = track(hoveredOptionStore, "hoveredOption");
    if (hoveredOption) {
      scrollToItem(listRef.current, ".item.hover");
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
      hoveredOption: hoveredOptionStore.hoveredOption,
      filteredOptions: filteredOptionsStore.value,
    },
  };
}

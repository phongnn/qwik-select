import {
  useRef,
  useClientEffect$,
  useStore,
  $,
  useWatch$,
  PropFunction,
} from "@builder.io/qwik";

import { SelectOption, SelectProps } from "./types";

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

interface HoveredOptionStore {
  hoveredOptionIndex: number;
  hoveredOption?: SelectOption;
}

function useHoveredOptionStore(filteredOptionsStore: FilteredOptionsStore) {
  const state = useStore<HoveredOptionStore>({ hoveredOptionIndex: -1 });

  const hoverSelectedOrFirstOption = $((opt: SelectOption | undefined) => {
    if (filteredOptionsStore.options.length > 0) {
      const optIndex = opt ? filteredOptionsStore.options.indexOf(opt) : -1;
      if (optIndex > 0) {
        state.hoveredOptionIndex = optIndex;
        state.hoveredOption = opt;
      } else {
        state.hoveredOptionIndex = 0;
        state.hoveredOption = filteredOptionsStore.options[0];
      }
    }
  });

  const hoverNextOption = $(() => {
    if (state.hoveredOptionIndex >= 0) {
      let index = state.hoveredOptionIndex + 1;
      if (index > filteredOptionsStore.options.length - 1) {
        index = 0;
      }
      state.hoveredOptionIndex = index;
      state.hoveredOption = filteredOptionsStore.options[index];
    }
  });

  const hoverPrevOption = $(() => {
    if (state.hoveredOptionIndex >= 0) {
      let index = state.hoveredOptionIndex - 1;
      if (index < 0) {
        index = filteredOptionsStore.options.length - 1;
      }
      state.hoveredOptionIndex = index;
      state.hoveredOption = filteredOptionsStore.options[index];
    }
  });

  const clearHoveredOption = $(() => {
    state.hoveredOptionIndex = -1;
    state.hoveredOption = undefined;
  });

  const actions = {
    hoverSelectedOrFirstOption,
    hoverNextOption,
    hoverPrevOption,
    clearHoveredOption,
  };
  return { hoveredOptionStore: state, actions };
}

interface FilteredOptionsStore {
  options: SelectOption[];
  loading: boolean;
}

type FilteredOptionsStoreConfig =
  | {
      options: SelectOption[];
      optionLabelKey: string;
    }
  | {
      fetcher: PropFunction<(text: string) => Promise<SelectOption[]>>;
      debounceTime: number;
    };

function useFilteredOptionsStore(config: FilteredOptionsStoreConfig) {
  const isAsync = "fetcher" in config;
  const state = useStore<FilteredOptionsStore>({
    options: isAsync ? [] : config.options,
    loading: false,
  });
  // timeout for debouncing fetch requests
  const internalState = useStore<{ timeout?: number }>({});

  const filterOptions = $(async (query: string) => {
    if (query === "") {
      state.options = isAsync ? [] : config.options;
    } else if (!isAsync) {
      const { optionLabelKey } = config;
      state.options = config.options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : (opt[optionLabelKey] as string);
        return label.toLowerCase().includes(query.toLowerCase());
      });
    } else {
      // debounce to avoid sending too many unnecessary requests
      state.options = [];
      state.loading = true;

      clearTimeout(internalState.timeout);
      // @ts-ignore
      internalState.timeout = setTimeout(async () => {
        const fetchedData = await config.fetcher(query);
        // only set data if menu hasn't been closed yet
        if (state.loading) {
          state.options = fetchedData;
          state.loading = false;
        }
      }, config.debounceTime);
    }
  });

  const clearFilter = $(() => {
    if (isAsync) {
      clearTimeout(internalState.timeout);
      state.options = [];
      state.loading = false;
    } else {
      state.options = config.options;
    }
  });

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
  config: { optionLabelKey: string; inputDebounceTime: number }
) {
  if (!props.options && !props.fetchOptions$) {
    throw Error(
      "[qwik-select] FATAL: please provide either fetchOptions$ or options prop."
    );
  }

  const filteredOptionsStoreConfig = props.fetchOptions$
    ? { fetcher: props.fetchOptions$, debounceTime: config.inputDebounceTime }
    : { options: props.options!, optionLabelKey: config.optionLabelKey };

  const {
    isOpenStore,
    actions: { toggleMenu, openMenu, closeMenu },
  } = useIsOpenStore();

  const {
    inputValueStore,
    actions: { setInputValue, clearInputValue },
  } = useInputValueStore();

  const {
    filteredOptionsStore,
    actions: { filterOptions, clearFilter },
  } = useFilteredOptionsStore(filteredOptionsStoreConfig);

  const {
    hoveredOptionStore,
    actions: {
      hoverSelectedOrFirstOption,
      hoverNextOption,
      hoverPrevOption,
      clearHoveredOption,
    },
  } = useHoveredOptionStore(filteredOptionsStore);

  const containerRef = useRef<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>();
  const listRef = useRef<HTMLElement>();

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

  useClientEffect$(function updateHoveredOptionWhenListChange({ track }) {
    track(filteredOptionsStore, "options");
    hoverSelectedOrFirstOption(props.value);
  });

  useWatch$(function updateHoveredOptionOnMenuToggle({ track }) {
    const isOpen = track(isOpenStore, "value");
    if (isOpen) {
      hoverSelectedOrFirstOption(props.value);
    } else {
      clearInputValue();
      clearFilter();
      clearHoveredOption();
    }
  });

  useWatch$(function scrollToSelectedOption({ track }) {
    // scroll to the selected option whenever the list is created
    // (i.e. whenever the menu is opened)
    const elem = track(listRef, "current");
    if (elem && props.value) {
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
      inputValue: inputValueStore.value,
      filteredOptions: filteredOptionsStore.options,
      loading: filteredOptionsStore.loading,
      hoveredOption: hoveredOptionStore.hoveredOption,
    },
    actions: { blur },
  };
}

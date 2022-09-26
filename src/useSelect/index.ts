import { useRef, useClientEffect$, $, useWatch$ } from "@builder.io/qwik";

import type { SelectProps } from "../types";
import { useIsOpenStore } from "./isOpenStore";
import { useInputValueStore } from "./inputValueStore";
import { useFilteredOptionsStore } from "./filteredOptionsStore";
import { useHoveredOptionStore } from "./hoveredOptionStore";
import { scrollToItem } from "./helpers";

export function useSelect(
  props: SelectProps,
  config: { optionLabelKey: string; inputDebounceTime: number }
) {
  /** CONFIGURATION */
  if (!props.options && !props.fetchOptions$) {
    throw Error(
      "[qwik-select] FATAL: please provide either fetchOptions$ or options prop."
    );
  }

  const filteredOptionsStoreConfig = props.fetchOptions$
    ? { fetcher: props.fetchOptions$, debounceTime: config.inputDebounceTime }
    : { options: props.options!, optionLabelKey: config.optionLabelKey };

  /** STATE MANAGEMENT */
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

  /** EVENT HANDLERS */
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

  const handleContainerPointerDown = $((event: PointerEvent) => {
    // avoid triggering "focusout" event when user clicks on a menu item
    // otherwise the item's click event won't fire
    if (event.target !== inputRef.current) {
      event.preventDefault();
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
    const inputValue = (event.target as HTMLInputElement).value;
    setInputValue(inputValue);
    filterOptions(inputValue);
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

  // need to use useClientEffect$ because useWatch$ would cause "stale tracked value" error
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

  /** OTHER ACTIONS (NOT RELATED TO STATE MANAGEMENT) */
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

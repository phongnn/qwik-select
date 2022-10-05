// prettier-ignore
import { useRef, useClientEffect$, $, QRL, Ref, PropFunction } from "@builder.io/qwik";

import type { OptionLabelKey } from "./types";
import { useIsOpenStore } from "./isOpenStore";
import { useInputValueStore } from "./inputValueStore";
import { useFilteredOptionsStore } from "./filteredOptionsStore";
import { useHoveredOptionStore } from "./hoveredOptionStore";

// these settings are directly from the user of the Select component
interface UseSelectProps<Option> {
  options?: Option[];
  value?: Option;
  fetchOptions$?: PropFunction<(text: string) => Promise<Option[]>>;
  onChange$?: PropFunction<(value: Option | undefined) => void>;
  onClear$?: PropFunction<() => void>;
  onInput$?: PropFunction<(text: string) => any>;
  onFocus$?: PropFunction<() => any>;
  onBlur$?: PropFunction<() => any>;
}

// these settings are from the Select component, not directly from the user
interface UseSelectConfig<Option> {
  optionLabelKey?: OptionLabelKey<Option>;
  inputDebounceTime?: number;
  scrollToHoveredOption?: QRL<(menuElem?: HTMLElement, opt?: Option) => void>;
}

function useSelect<Option>(
  props: UseSelectProps<Option>,
  config: UseSelectConfig<Option>
) {
  const filteredOptionsStoreConfig = props.fetchOptions$
    ? { fetcher: props.fetchOptions$, debounceTime: config.inputDebounceTime! }
    : { options: props.options!, optionLabelKey: config.optionLabelKey! };

  /** STATE MANAGEMENT */
  const {
    isOpenStore,
    actions: { toggleMenu, openMenu, closeMenu },
  } = useIsOpenStore();

  const {
    inputValueStore,
    actions: { setInputValue, clearInputValue },
  } = useInputValueStore(props.onInput$);

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
  const containerRef: Ref<HTMLElement> = useRef<HTMLElement>();
  const inputRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>();
  const listRef: Ref<HTMLElement> = useRef<HTMLElement>();

  const handleContainerClick = $((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!listRef.current?.contains(target)) {
      inputRef.current?.focus();
      toggleMenu();
    }
  });

  const handleContainerPointerDown = $((event: PointerEvent) => {
    // avoid triggering "blur" event when user clicks on a menu item
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

  const handleInputFocus = $(() => {
    if (props.onFocus$) {
      props.onFocus$();
    }
  });

  const handleInputBlur = $(() => {
    if (props.onBlur$) {
      props.onBlur$();
    }
    closeMenu();
  });

  // prettier-ignore
  useClientEffect$(() => {
    containerRef.current?.addEventListener("click", handleContainerClick);
    containerRef.current?.addEventListener("pointerdown", handleContainerPointerDown);
    inputRef.current?.addEventListener("keydown", handleInputKeyDown);
    inputRef.current?.addEventListener("input", handleInputChange);
    inputRef.current?.addEventListener("focus", handleInputFocus);
    inputRef.current?.addEventListener("blur", handleInputBlur); // focusout

    return () => {
      containerRef.current?.removeEventListener("click", handleContainerClick);
      containerRef.current?.removeEventListener("pointerdown", handleContainerPointerDown);
      inputRef.current?.removeEventListener("keydown", handleInputKeyDown);
      inputRef.current?.removeEventListener("input", handleInputChange);
      inputRef.current?.removeEventListener("focus", handleInputFocus);
      inputRef.current?.removeEventListener("blur", handleInputBlur);
    };
  });

  useClientEffect$(function handleMenuToggle({ track }) {
    const isOpen = track(isOpenStore, "value");
    if (isOpen) {
      // let the menu opens first before we set the hovered state
      setTimeout(() => hoverSelectedOrFirstOption(props.value));
    } else {
      clearInputValue();
      clearFilter();
      clearHoveredOption();
    }
  });

  useClientEffect$(function updateHoveredOptionWhenListChange({ track }) {
    track(filteredOptionsStore, "options");
    if (isOpenStore.value) {
      hoverSelectedOrFirstOption(props.value);
    }
  });

  useClientEffect$(function scrollToHoveredOption({ track }) {
    const hoveredOption = track(hoveredOptionStore, "hoveredOption");
    if (hoveredOption && config.scrollToHoveredOption) {
      config.scrollToHoveredOption(listRef.current, hoveredOption);
    }
  });

  /** OTHER ACTIONS (NOT RELATED TO STATE MANAGEMENT) */
  // NOTE: these actions are QRLs so they are serializable and can be called within event handlers
  const focus = $(() => {
    inputRef.current?.focus();
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
    actions: { focus, blur },
  };
}

export type { UseSelectProps, UseSelectConfig, OptionLabelKey };
export { useSelect };

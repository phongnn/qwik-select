// prettier-ignore
import { useRef, useClientEffect$, $, QRL, Ref, PropFunction, useStore } from "@builder.io/qwik";

import type { OptionLabelKey } from "./types";
import {
  useFilteredOptionsStore,
  FilteredOptionsStoreConfig,
} from "./filteredOptionsStore";
import { useHoveredOptionStore } from "./hoveredOptionStore";

function useIsOpenStore() {
  const state = useStore({ value: false });
  const setMenuOpen = $((open: boolean) => (state.value = open));
  return { isOpenStore: state, actions: { setMenuOpen } };
}

function useInputValueStore(onInput$?: PropFunction<(text: string) => any>) {
  const state = useStore({ value: "" });
  const setInputValue = $((val: string) => {
    if (onInput$ && val !== state.value) {
      onInput$(val);
    }
    state.value = val;
  });
  return { inputValueStore: state, actions: { setInputValue } };
}

// these settings are directly from the user of the Select component
interface UseSelectProps<Option> {
  options?: Option[];
  value?: Option | Option[];
  fetchOptions$?: PropFunction<(text: string) => Promise<Option[]>>;
  onChange$?: PropFunction<(opt: Option) => any>;
  onUnselect$?: PropFunction<(opt: Option) => any>;
  onClear$?: PropFunction<() => any>;
  onInput$?: PropFunction<(text: string) => any>;
  onFocus$?: PropFunction<() => any>;
  onBlur$?: PropFunction<() => any>;
}

// these settings are from the Select component, not directly from the user
interface UseSelectConfig<Option> {
  optionLabelKey?: OptionLabelKey<Option>;
  inputDebounceTime?: number;
  shouldFilterSelectedOptions?: boolean;
  scrollToHoveredOption?: QRL<(menuElem?: HTMLElement, opt?: Option) => void>;
}

function useSelect<Option>(
  props: UseSelectProps<Option>,
  config: UseSelectConfig<Option>
) {
  const filteredOptionsStoreConfig: FilteredOptionsStoreConfig<Option> =
    props.fetchOptions$ !== undefined
      ? {
          fetcher: props.fetchOptions$,
          debounceTime: config.inputDebounceTime!,
        }
      : { options: props.options!, optionLabelKey: config.optionLabelKey! };

  // filter selected options for multi-select
  const shouldFilterSelectedOptions =
    Array.isArray(props.value) && config.shouldFilterSelectedOptions;

  /** STATE MANAGEMENT */
  const {
    isOpenStore,
    actions: { setMenuOpen },
  } = useIsOpenStore();

  const {
    inputValueStore,
    actions: { setInputValue },
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

  /** PRIVATE ACTIONS */
  const filterSelectedOptions = shouldFilterSelectedOptions
    ? $((options: Option[]) =>
        options.filter((opt) => {
          const selectedOptions = props.value as Option[];
          if (typeof opt === "string") {
            return selectedOptions.includes(opt) === false;
          } else {
            return selectedOptions.every(
              (so) => so[config.optionLabelKey!] !== opt[config.optionLabelKey!]
            );
          }
        })
      )
    : undefined;

  const openMenu = $(async () => {
    // filter options before opening the menu to avoid flashing of "No options" message
    await filterOptions(inputValueStore.value, filterSelectedOptions);
    await setMenuOpen(true);
    await hoverSelectedOrFirstOption(props.value);
  });

  const closeMenu = $(async () => {
    setMenuOpen(false);
    setInputValue("");
    clearFilter();
    clearHoveredOption();
  });

  /** EVENT HANDLERS */
  const containerRef: Ref<HTMLElement> = useRef<HTMLElement>();
  const inputRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>();
  const listRef: Ref<HTMLElement> = useRef<HTMLElement>();

  const handleContainerClick = $((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!listRef.current?.contains(target)) {
      inputRef.current?.focus();
      if (isOpenStore.value) {
        closeMenu();
      } else {
        openMenu();
      }
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
        if (props.onChange$) {
          props.onChange$(hoveredOptionStore.hoveredOption);
        }
        closeMenu();
      }
    } else if (event.key === "Backspace" || event.key === "Delete") {
      // prettier-ignore
      if (inputValueStore.value === "") {
        if (props.value !== undefined && !Array.isArray(props.value) && props.onClear$ !== undefined) {
          // single-select: clear selected option
          props.onClear$();
        } else if (Array.isArray(props.value) && props.value.length > 0 && props.onUnselect$ !== undefined) {
          // multi-select: remove the last selected option
          props.onUnselect$(props.value[props.value.length - 1]);
        }
        if (isOpenStore.value) {
          closeMenu()
        }
      }
    } else if (event.key === "Escape") {
      closeMenu();
    }
  });

  const handleInputChange = $(async (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    await setInputValue(inputValue);
    if (isOpenStore.value) {
      filterOptions(inputValue, filterSelectedOptions);
    } else {
      openMenu();
    }
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

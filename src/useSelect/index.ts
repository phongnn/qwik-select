// prettier-ignore
import { useRef, useClientEffect$, $, Ref, PropFunction, useStore } from "@builder.io/qwik";

import type { OptionLabelKey } from "./types";
// prettier-ignore
import { useFilteredOptionsStore, useAsyncFilteredOptionsStore } from "./filteredOptionsStore";
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
  onSelect$?: PropFunction<(opt: Option) => any>;
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
}

function useSelect<Option>(
  props: UseSelectProps<Option>,
  config: UseSelectConfig<Option>
) {
  const isAsync = props.fetchOptions$ !== undefined;
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
  } = isAsync
    ? useAsyncFilteredOptionsStore({ fetcher: props.fetchOptions$! })
    : useFilteredOptionsStore({
        options: props.options!,
        optionLabelKey: config.optionLabelKey!,
      });

  const {
    hoveredOptionStore,
    actions: {
      hoverSelectedOrFirstOption,
      hoverAdjacentOption,
      clearHoveredOption,
    },
  } = useHoveredOptionStore(filteredOptionsStore);

  const internalState = useStore<{ inputDebounceTimer?: number }>({});

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
    if (!isAsync) {
      // filter options before opening the menu to avoid flashing of "No options" message
      await filterOptions(inputValueStore.value, filterSelectedOptions);
      await setMenuOpen(true);
      await hoverSelectedOrFirstOption(props.value);
    } else {
      filterOptions(inputValueStore.value, filterSelectedOptions);
      await setMenuOpen(true);
    }
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
  const menuRef: Ref<HTMLElement> = useRef<HTMLElement>();

  const handleContainerClick = $((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!menuRef.current?.contains(target)) {
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
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (isOpenStore.value) {
        hoverAdjacentOption(event.key.slice(5) as any); // remove "Arrow" prefix
      } else {
        openMenu();
      }
    } else if (event.key === "Enter" || event.key === "Tab") {
      if (hoveredOptionStore.hoveredOption) {
        if (props.onSelect$) {
          props.onSelect$(hoveredOptionStore.hoveredOption);
        }
        closeMenu();
      }
    } else if (event.key === "Backspace" || event.key === "Delete") {
      // prettier-ignore
      if (inputValueStore.value === "") {
        if (props.value && !Array.isArray(props.value) && props.onClear$) {
          // single-select: clear selected option
          props.onClear$();
        } else if (Array.isArray(props.value) && props.value.length > 0 && props.onUnselect$) {
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
    const isMenuOpen = isOpenStore.value;
    await setInputValue(inputValue);

    if (!isAsync) {
      if (isMenuOpen) {
        filterOptions(inputValue, filterSelectedOptions);
      } else {
        openMenu();
      }
    } else {
      // debounce to avoid sending too many requests
      clearTimeout(internalState.inputDebounceTimer);
      // @ts-ignore
      internalState.inputDebounceTimer = setTimeout(() => {
        filterOptions(inputValue, filterSelectedOptions);
      }, config.inputDebounceTime);
      if (!isMenuOpen) {
        setMenuOpen(true);
      }
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
    track(() => filteredOptionsStore.options);
    if (isOpenStore.value) {
      hoverSelectedOrFirstOption(props.value);
    }
  });

  /** OTHER ACTIONS (NOT RELATED TO STATE MANAGEMENT) */
  // these actions are QRLs (serializable) so they can be called from within event handlers
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
      menuRef,
    },
    stores: {
      isOpenStore,
      inputValueStore,
      filteredOptionsStore,
      hoveredOptionStore,
    },
    actions: { focus, blur },
  };
}

export type { UseSelectProps, UseSelectConfig, OptionLabelKey };
export { useSelect };

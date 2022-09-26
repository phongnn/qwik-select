import { useStore, $ } from "@builder.io/qwik";

import { SelectOption } from "../types";

interface HoveredOptionStore {
  hoveredOptionIndex: number;
  hoveredOption?: SelectOption;
}

export function useHoveredOptionStore(filteredOptionsStore: {
  options: SelectOption[];
}) {
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

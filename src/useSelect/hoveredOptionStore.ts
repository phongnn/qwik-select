import { useStore, $ } from "@builder.io/qwik";

interface HoveredOptionStore<Option> {
  hoveredOptionIndex: number;
  hoveredOption?: Option;
}

export function useHoveredOptionStore<Option>(filteredOptionsStore: {
  options: Option[];
}) {
  const state = useStore<HoveredOptionStore<Option>>({
    hoveredOptionIndex: -1,
  });

  // prettier-ignore
  const hoverSelectedOrFirstOption = $((selectedVal: Option | Option[] | undefined) => {
    // empty list, no option to hover
    if (filteredOptionsStore.options.length === 0) {
      return;
    }

    // single selected option, hover if found in the list
    if (selectedVal && !Array.isArray(selectedVal)) {
      const optIndex = filteredOptionsStore.options.indexOf(selectedVal);
      if (optIndex > 0) {
        state.hoveredOptionIndex = optIndex;
        state.hoveredOption = selectedVal;
        return;
      }
    }

    // otherwise, hover the first option
    state.hoveredOptionIndex = 0;
    state.hoveredOption = filteredOptionsStore.options[0];
  });

  const hoverAdjacentOption = $((direction: "Up" | "Down") => {
    if (state.hoveredOptionIndex < 0) {
      return;
    }
    const delta = direction === "Down" ? 1 : -1;
    let index = state.hoveredOptionIndex + delta;
    if (index > filteredOptionsStore.options.length - 1) {
      index = 0;
    } else if (index < 0) {
      index = filteredOptionsStore.options.length - 1;
    }
    state.hoveredOptionIndex = index;
    state.hoveredOption = filteredOptionsStore.options[index];
  });

  const clearHoveredOption = $(() => {
    state.hoveredOptionIndex = -1;
    state.hoveredOption = undefined;
  });

  const actions = {
    hoverSelectedOrFirstOption,
    hoverAdjacentOption,
    clearHoveredOption,
  };
  return { hoveredOptionStore: state, actions };
}

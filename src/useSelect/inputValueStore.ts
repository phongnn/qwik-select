import { useStore, $ } from "@builder.io/qwik";

export function useInputValueStore() {
  const state = useStore({ value: "" });

  const setInputValue = $((val: string) => (state.value = val));
  const clearInputValue = $(() => (state.value = ""));

  return {
    inputValueStore: state,
    actions: { setInputValue, clearInputValue },
  };
}

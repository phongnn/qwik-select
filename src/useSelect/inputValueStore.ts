import { useStore, $, PropFunction } from "@builder.io/qwik";

export function useInputValueStore(
  onInput$?: PropFunction<(text: string) => any>
) {
  const state = useStore({ value: "" });

  const setInputValue = $((val: string) => {
    if (onInput$ && val !== state.value) {
      onInput$(val);
    }
    state.value = val;
  });

  const clearInputValue = $(() => setInputValue(""));

  return {
    inputValueStore: state,
    actions: { setInputValue, clearInputValue },
  };
}

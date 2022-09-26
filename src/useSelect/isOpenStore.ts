import { useStore, $ } from "@builder.io/qwik";

export function useIsOpenStore() {
  const state = useStore({ value: false });

  const toggleMenu = $(() => (state.value = !state.value));
  const openMenu = $(() => (state.value = true));
  const closeMenu = $(() => (state.value = false));

  return { isOpenStore: state, actions: { toggleMenu, openMenu, closeMenu } };
}

import { component$, useStore, mutable, $, useStyles$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import styles from "qwik-select/style.css";

interface Item {
  value: number;
  label: string;
}

export const items: Item[] = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
  { value: 4, label: "Four" },
  { value: 5, label: "Five" },
];

export const filter = $((text: string) => {
  if ("Cypress" in window) {
    // @ts-ignore
    if (window.__qwik_select__async_calls__) {
      // @ts-ignore
      window.__qwik_select__async_calls__.push(text);
    } else {
      // @ts-ignore
      window.__qwik_select__async_calls__ = [text];
    }
  }

  console.log("**** fetching options containing '" + text + "' ...");

  return new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      const lowercaseText = text.toLowerCase();
      const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(lowercaseText)
      );
      resolve(filteredItems);
    }, 1000);
  });
});

export default component$(() => {
  const state = useStore({
    selectedItem: undefined as Item | undefined,
  });

  useStyles$(styles);
  return (
    <div>
      <Select
        fetchOptions$={filter}
        inputDebounceTime={500}
        value={mutable(state.selectedItem)}
        onChange$={(it) => (state.selectedItem = it)}
      />
      {state.selectedItem && (
        <p>You've selected {(state.selectedItem as Item).label}.</p>
      )}
    </div>
  );
});

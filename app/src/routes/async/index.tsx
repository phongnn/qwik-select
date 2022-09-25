import { component$, useStore, mutable, $ } from "@builder.io/qwik";
import { Select } from "qwik-select";

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
    selectedItem: null,
  });

  return (
    <div>
      <Select
        fetchOptions$={filter}
        value={mutable(state.selectedItem)}
        onChange$={(it) => (state.selectedItem = it)}
      />
      {state.selectedItem && (
        <p>You've selected {(state.selectedItem as Item).label}.</p>
      )}
    </div>
  );
});

import { component$, useStore, $, useStyles$ } from "@builder.io/qwik";
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
  return new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      const lowercaseText = text.toLowerCase();
      const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(lowercaseText)
      );
      resolve(filteredItems);
    });
  });
});

export default component$(() => {
  const state = useStore({
    selectedItems: [items[2]], // "Three"
  });

  useStyles$(styles);
  return (
    <div>
      <Select
        fetchOptions$={filter}
        value={state.selectedItems}
        onSelect$={(it) => (state.selectedItems = [...state.selectedItems, it])}
      />
    </div>
  );
});

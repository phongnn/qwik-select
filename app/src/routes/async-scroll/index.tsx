import { component$, useStore, $, useStyles$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import styles from "qwik-select/style.css?inline";

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
  { value: 6, label: "Six" },
  { value: 7, label: "Seven" },
  { value: 8, label: "Eight" },
  { value: 9, label: "Nine" },
  { value: 10, label: "Ten" },
];

export const filter = $((text: string) => {
  return new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      const lowercaseText = text.toLowerCase();
      const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(lowercaseText)
      );
      resolve(filteredItems);
    }, 500);
  });
});

export default component$(() => {
  const state = useStore({
    selectedItem: items[7] as Item | undefined,
  });

  useStyles$(styles);
  return (
    <Select
      fetchOptions$={filter}
      value={state.selectedItem}
      onSelect$={(it) => (state.selectedItem = it)}
      onClear$={() => (state.selectedItem = undefined)}
    />
  );
});

import { component$, useStore, useStyles$ } from "@builder.io/qwik";
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
];

export default component$(() => {
  const state = useStore({
    items: items,
    selectedItems: [] as Item[],
  });

  useStyles$(styles);
  return (
    <div>
      <Select
        options={state.items}
        value={state.selectedItems}
        onSelect$={(it) => (state.selectedItems = [...state.selectedItems, it])}
        shouldFilterSelectedOptions={false}
      />
    </div>
  );
});

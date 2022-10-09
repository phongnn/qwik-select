import { component$, useStore, mutable, useStyles$ } from "@builder.io/qwik";
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

export default component$(() => {
  const state = useStore({
    items: items,
    selectedItems: [items[3]], // "Four"
  });

  useStyles$(styles);
  return (
    <div>
      <Select
        options={state.items}
        value={mutable(state.selectedItems)}
        onChange$={(it) => (state.selectedItems = [...state.selectedItems, it])}
        onClear$={() => (state.selectedItems = [])}
        onUnselect$={(opt) =>
          (state.selectedItems = state.selectedItems.filter((it) => it !== opt))
        }
      />
    </div>
  );
});

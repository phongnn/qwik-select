import { component$, useStore, mutable, useStyles$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import styles from "qwik-select/style.css";

interface Item {
  value: number;
  title: string;
}

export const items: Item[] = [
  { value: 1, title: "One" },
  { value: 2, title: "Two" },
  { value: 3, title: "Three" },
  { value: 4, title: "Four" },
  { value: 5, title: "Five" },
];

export default component$(() => {
  const state = useStore({
    items: items,
    selectedItem: undefined as Item | undefined,
  });

  useStyles$(styles);
  return (
    <div>
      <Select
        options={state.items}
        optionLabelKey="title"
        value={mutable(state.selectedItem)}
        onSelect$={(it) => (state.selectedItem = it)}
      />
    </div>
  );
});

import { component$, useStore, mutable } from "@builder.io/qwik";
import { Select } from "qwik-select";

interface Item {
  value: number;
  label: string;
}

export const items: Item[] = [
  { value: 1, label: "Apple" },
  { value: 2, label: "Banana" },
  { value: 3, label: "Pear" },
  { value: 4, label: "Pineapple" },
  { value: 5, label: "Kiwi" },
];

export default component$(() => {
  const state = useStore({
    items: items,
    selectedItem: null,
  });

  return (
    <div>
      <Select
        options={state.items}
        value={mutable(state.selectedItem)}
        onChange$={(it) => (state.selectedItem = it)}
      />
      {state.selectedItem && (
        <p>You've selected {(state.selectedItem as Item).label}.</p>
      )}
    </div>
  );
});
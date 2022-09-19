import { component$, useStore } from "@builder.io/qwik";
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
  { value: 6, label: "Six" },
  { value: 7, label: "Seven" },
  { value: 8, label: "Eight" },
  { value: 9, label: "Nine" },
  { value: 10, label: "Ten" },
];

export const initialValue = items[8]; // "Nine"

export default component$(() => {
  const state = useStore({
    items: items,
    initialValue: initialValue,
    selectedItem: initialValue,
  });

  return (
    <div>
      <Select
        options={state.items}
        initialValue={state.initialValue}
        onChange$={(it) => (state.selectedItem = it)}
      />
      {state.selectedItem && (
        <p>You've selected {(state.selectedItem as Item).label}.</p>
      )}
    </div>
  );
});

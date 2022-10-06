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
    selectedItem: undefined as Item | undefined,
    disabled: true,
  });

  useStyles$(styles);
  return (
    <div>
      <div class="mb-3">
        <button onClick$={() => (state.disabled = !state.disabled)}>
          {state.disabled ? "Enable Select" : "Disable Select"}
        </button>
      </div>

      <Select
        options={state.items}
        value={mutable(state.selectedItem)}
        onChange$={(it) => (state.selectedItem = it)}
        disabled={mutable(state.disabled)}
      />
      {state.selectedItem && (
        <p>You've selected {(state.selectedItem as Item).label}.</p>
      )}
    </div>
  );
});

import { component$, useStore, mutable } from "@builder.io/qwik";
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

export default component$(() => {
  const state = useStore({
    items: items,
    selectedItem: null,
    log: "",
  });

  return (
    <div>
      <Select
        options={state.items}
        value={mutable(state.selectedItem)}
        onChange$={(it) => (state.selectedItem = it)}
        onInput$={(text) => (state.log = text ? `You've entered ${text}` : "")}
        onFocus$={() => (state.log = "Focused.")}
        onBlur$={() => (state.log = "Blurred.")}
      />
      {state.selectedItem && (
        <p>You've selected {(state.selectedItem as Item).label}.</p>
      )}
      <div data-testid="log" class="mt-96 h-1">
        {state.log}
      </div>
    </div>
  );
});

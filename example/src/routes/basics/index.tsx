import { component$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import type { SelectOption } from "qwik-select";

export const items: SelectOption[] = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
  { value: "4", label: "Four" },
  { value: "5", label: "Five" },
];

export default component$(() => {
  return (
    <div>
      <Select options={items} />
    </div>
  );
});

import { component$, useStore } from "@builder.io/qwik";
import { add } from "qwik-select";

export const Counter = component$(() => {
  const store = useStore({ count: 0 });

  return (
    <div>
      <p>Count: {add(store.count, 100)}</p>
      <p>
        <button onClick$={() => store.count++}>Increment</button>
      </p>
    </div>
  );
});

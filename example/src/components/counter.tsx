import { component$, useStyles$, useStore } from "@builder.io/qwik";
import { add } from "qwik-lib-starter";

export const Counter = component$(() => {
  const store = useStore({ count: 0 });
  useStyles$(`
  .counter {
    border: 3px solid #1474ff;
    padding: 10px;
    border-radius: 10px;
    color: #1474ff;
  }
`);

  return (
    <div>
      <p>Count: {add(store.count, 100)}</p>
      <p>
        <button onClick$={() => store.count++}>Increment</button>
      </p>
    </div>
  );
});

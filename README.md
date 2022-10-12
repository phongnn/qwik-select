# qwik-select

A select/autocomplete component for Qwik apps.

You can use the built-in unstyled component or build your own UI component with the core hook.

- Single select
- Multi-select (coming soon)
- Typeahead
- Async support (dynamically fetching data)
- Zero dependencies

## Installation

```bash
  npm install qwik-select
```

## Usage

```javascript
import { component$, useStyles$, useStore, mutable } from "@builder.io/qwik";
import { Select } from "qwik-select";
import styles from "qwik-select/style.css";

export default component$(() => {
  const state = useStore({
    items: ["One", "Two", "Three", "Four", "Five"],
    selectedItem: undefined,
  });

  useStyles$(styles);
  return (
    <div>
      <Select
        options={state.items}
        value={mutable(state.selectedItem)}
        onSelect$={(it) => (state.selectedItem = it)}
        onClear$={() => (state.selectedItem = undefined)}
      />
    </div>
  );
});
```

See the [documentation](https://phongnn.github.io/qwik-select) for more examples.

## Acknowledgements

- [solid-select](https://github.com/thisbeyond/solid-select)
- [svelte-select](https://github.com/rob-balfre/svelte-select)

## License

[MIT](https://choosealicense.com/licenses/mit/)

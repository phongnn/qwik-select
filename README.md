# qwik-select

A select/autocomplete component for Qwik apps.

You can use the built-in component (customizable with CSS variables) or build your own UI with our core hook.

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
import { component$, useStore, mutable } from "@builder.io/qwik";
import { Select } from "qwik-select";

export default component$(() => {
  const state = useStore({
    items: ["One", "Two", "Three", "Four", "Five"],
    selectedItem: null,
  });

  return (
    <div>
      <Select
        options={state.items}
        value={mutable(state.selectedItem)}
        onChange$={(it) => (state.selectedItem = it)}
      />
    </div>
  );
});
```

## Acknowledgements

- [solid-select](https://github.com/thisbeyond/solid-select)
- [svelte-select](https://github.com/rob-balfre/svelte-select)

## License

[MIT](https://choosealicense.com/licenses/mit/)

# qwik-select

A select/autocomplete component for Qwik apps.

- Single select
- Multi-select (coming soon)
- Typeahead
- Async support (dynamically fetching data)
- Zero dependencies

## Examples

<iframe
  src="https://stackblitz.com/edit/qwik-select-demo?ctl=1&embed=1&file=src/routes/index.tsx"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
>
</iframe>

## Installation

```bash
  npm install qwik-select
```

## Documentation

You can use the unstyled `Select` component or develop your own UI component with the `useSelect` hook.

### Select component

`Select` is a controlled input, so you usually need to set the `value` prop and handle the `onChange$` and probably `onClear$` events.

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
        onChange$={(it) => (state.selectedItem = it)}
        onClear$={() => (state.selectedItem = undefined)}
      />
    </div>
  );
});
```

#### Props

| Prop              | Type                                | Description                                                                                                          |
| ----------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| options           | Option[]                            | Required unless `fetchOptions$` is provided. List of selectable options. Options can be plain strings or objects.    |
| fetchOptions$     | (text: string) => Promise<Option[]> | Required unless `options` is provided. Asynchronously fetches a list of options as the user types in the text input. |
| value             | Option \| `undefined`               | The selected option.                                                                                                 |
| autofocus         | boolean                             | Optional. The text input should get focus when the page loads. Default: false.                                       |
| disabled          | boolean                             | Optional. The Select component should be disabled. Default: false.                                                   |
| placeholder       | string                              | Optional. The placeholder text. Default: "Select...".                                                                |
| noOptionsMessage  | string                              | Optional. The text to display when no options are available. Default: "No options".                                  |
| optionLabelKey    | OptionLabelKey&lt;Option&gt;        | Optional. Only needed when options are objects. Default: "label".                                                    |
| inputDebounceTime | number                              | Optional. Only needed when `fetchOptions$` is provided. Default: 200 (milliseconds).                                 |

#### Events

| Event     | Callback               | Description                                  |
| --------- | ---------------------- | -------------------------------------------- |
| onChange$ | (value: Option) => any | fires when an option is selected.            |
| onClear$  | () => any              | fires when the Select component is cleared.  |
| onInput$  | (text: string) => any  | fires when the user types in the text input. |
| onFocus$  | () => any              | fires when the text input gets focused.      |
| onBlur$   | () => any              | fires when the text input has lost focus.    |

#### Styling

The `Select` component is unstyled. You can copy the [sample CSS file](https://github.com/phongnn/qwik-select/blob/release/src/style.css), modify it, and use it with `useStyles$`:

```javascript
import { component$, useStyles$ } from "@builder.io/qwik";
import { Select } from "qwik-select";
import customStyles from "./style.css?inline";

export default component$(() => {
  useStyles$(customStyles);

  return (
    <div>
      <Select options={items} />
    </div>
  );
});
```

### useSelect hook

If the built-in `Select` component doesn't meet your requirements, you can opt to use the `useSelect` hook which provides the core functionality without UI. For an example of how to use the hook, check out the [`Select` component's source code](https://github.com/phongnn/qwik-select/blob/release/src/Select/index.tsx).

## Acknowledgements

- [solid-select](https://github.com/thisbeyond/solid-select)
- [svelte-select](https://github.com/rob-balfre/svelte-select)

## License

[MIT](https://choosealicense.com/licenses/mit/)

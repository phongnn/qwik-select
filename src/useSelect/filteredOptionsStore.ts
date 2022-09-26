import { useStore, $, PropFunction } from "@builder.io/qwik";

import { SelectOption } from "../types";

interface FilteredOptionsStore {
  options: SelectOption[];
  loading: boolean;
}

type FilteredOptionsStoreConfig =
  | {
      options: SelectOption[];
      optionLabelKey: string;
    }
  | {
      fetcher: PropFunction<(text: string) => Promise<SelectOption[]>>;
      debounceTime: number;
    };

export function useFilteredOptionsStore(config: FilteredOptionsStoreConfig) {
  const isAsync = "fetcher" in config;
  const state = useStore<FilteredOptionsStore>({
    options: isAsync ? [] : config.options,
    loading: false,
  });
  // use setTimeout to debounce fetch requests
  const internalState = useStore<{ timer?: number }>({});

  const filterOptions = $(async (query: string) => {
    if (query === "") {
      state.options = isAsync ? [] : config.options;
    } else if (!isAsync) {
      const { optionLabelKey } = config;
      state.options = config.options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : (opt[optionLabelKey] as string);
        return label.toLowerCase().includes(query.toLowerCase());
      });
    } else {
      // debounce to avoid sending too many unnecessary requests
      state.options = [];
      state.loading = true;

      clearTimeout(internalState.timer);
      // @ts-ignore
      internalState.timer = setTimeout(async () => {
        const fetchedData = await config.fetcher(query);
        // only set data if menu hasn't been closed yet
        if (state.loading) {
          state.options = fetchedData;
          state.loading = false;
        }
      }, config.debounceTime);
    }
  });

  const clearFilter = $(() => {
    if (isAsync) {
      clearTimeout(internalState.timer);
      state.options = [];
      state.loading = false;
    } else {
      state.options = config.options;
    }
  });

  return {
    filteredOptionsStore: state,
    actions: { filterOptions, clearFilter },
  };
}

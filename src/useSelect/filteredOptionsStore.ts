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

interface InternalState {
  inputDebounceTimer?: number;
  lastQuery?: string;
}

export function useFilteredOptionsStore(config: FilteredOptionsStoreConfig) {
  const isAsync = "fetcher" in config;
  const state = useStore<FilteredOptionsStore>({
    options: isAsync ? [] : config.options,
    loading: false,
  });
  const internalState = useStore<InternalState>({});

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
      state.options = [];
      state.loading = true;

      // debounce to avoid sending too many unnecessary requests
      clearTimeout(internalState.inputDebounceTimer);
      // @ts-ignore
      internalState.inputDebounceTimer = setTimeout(async () => {
        internalState.lastQuery = query;
        const fetchedData = await config.fetcher(query);

        // take the last query's data only (ignore prev queries),
        // and only set data if menu hasn't been closed yet
        if (state.loading && query === internalState.lastQuery) {
          state.options = fetchedData;
          state.loading = false;
        }
      }, config.debounceTime);
    }
  });

  const clearFilter = $(() => {
    if (isAsync) {
      clearTimeout(internalState.inputDebounceTimer);
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

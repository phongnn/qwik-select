import {
  useStore,
  $,
  PropFunction,
  QRL,
  useClientEffect$,
} from "@builder.io/qwik";

import { OptionLabelKey } from "./types";

interface FilteredOptionsStore<Option> {
  options: Option[];
  loading: boolean;
}

type FilteredOptionsStoreConfig<Option> =
  | {
      options: Option[];
      optionLabelKey: OptionLabelKey<Option>;
      extraFilter?: QRL<(options: Option[]) => Option[]>;
    }
  | {
      fetcher: PropFunction<(text: string) => Promise<Option[]>>;
      debounceTime: number;
      extraFilter?: QRL<(options: Option[]) => Option[]>;
    };

interface InternalState {
  inputDebounceTimer?: number;
  lastQuery?: string;
}

function useFilteredOptionsStore<Option>(
  config: FilteredOptionsStoreConfig<Option>
) {
  const isAsync = "fetcher" in config;
  const state = useStore<FilteredOptionsStore<Option>>({
    options: isAsync || config.extraFilter !== undefined ? [] : config.options,
    loading: false,
  });
  const internalState = useStore<InternalState>({});

  useClientEffect$(async () => {
    if (!isAsync && config.extraFilter !== undefined) {
      state.options = await config.extraFilter(config.options);
    }
  });

  const clearFilter = $(async () => {
    if (isAsync) {
      clearTimeout(internalState.inputDebounceTimer);
      state.options = [];
      state.loading = false;
    } else {
      state.options = config.extraFilter
        ? await config.extraFilter(config.options)
        : config.options;
    }
  });

  const filterOptions = $(async (query: string) => {
    if (query === "") {
      await clearFilter();
    } else if (!isAsync) {
      const { optionLabelKey, extraFilter } = config;
      const filteredOptions = config.options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : (opt[optionLabelKey] as string);
        return label.toLowerCase().includes(query.toLowerCase());
      });
      state.options = extraFilter
        ? await extraFilter(filteredOptions)
        : filteredOptions;
    } else {
      state.options = [];
      state.loading = true;

      // debounce to avoid sending too many unnecessary requests
      clearTimeout(internalState.inputDebounceTimer);
      // @ts-ignore
      internalState.inputDebounceTimer = setTimeout(async () => {
        const { fetcher, extraFilter } = config;
        internalState.lastQuery = query;
        const fetchedData = await fetcher(query);

        // take the last query's data only (ignore prev queries),
        // and only set data if menu hasn't been closed yet
        if (state.loading && query === internalState.lastQuery) {
          state.options = extraFilter
            ? await extraFilter(fetchedData)
            : fetchedData;
          state.loading = false;
        }
      }, config.debounceTime);
    }
  });

  return {
    filteredOptionsStore: state,
    actions: { filterOptions, clearFilter },
  };
}

export type { FilteredOptionsStoreConfig };
export { useFilteredOptionsStore };

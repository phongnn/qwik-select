import { useStore, $, PropFunction, QRL } from "@builder.io/qwik";

import { OptionLabelKey } from "./types";

interface FilteredOptionsStore<Option> {
  options: Option[];
  loading: boolean;
}

type FilteredOptionsStoreConfig<Option> =
  | {
      options: Option[];
      optionLabelKey: OptionLabelKey<Option>;
    }
  | {
      fetcher: PropFunction<(text: string) => Promise<Option[]>>;
      debounceTime: number;
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
    options: [],
    loading: false,
  });
  const internalState = useStore<InternalState>({});

  const clearFilter = $(() => {
    state.options = [];
    state.loading = false;
  });

  const filterOptions = $(
    async (
      query: string,
      filterSelectedOptions?: QRL<(options: Option[]) => Option[]>
    ) => {
      if (!isAsync) {
        const { optionLabelKey } = config;
        const filteredOptions = config.options.filter((opt) => {
          const label =
            typeof opt === "string" ? opt : (opt[optionLabelKey] as string);
          return label.toLowerCase().includes(query.toLowerCase());
        });

        state.options = filterSelectedOptions
          ? await filterSelectedOptions(filteredOptions)
          : filteredOptions;
      } else {
        state.options = [];
        state.loading = true;

        // debounce to avoid sending too many requests
        clearTimeout(internalState.inputDebounceTimer);
        // @ts-ignore
        internalState.inputDebounceTimer = setTimeout(async () => {
          const { fetcher } = config;
          internalState.lastQuery = query;
          const fetchedData = await fetcher(query);

          // take the last query's data only (ignore prev queries),
          // and only set data if menu hasn't been closed yet
          if (state.loading && query === internalState.lastQuery) {
            state.options = filterSelectedOptions
              ? await filterSelectedOptions(fetchedData)
              : fetchedData;
            state.loading = false;
          }
        }, config.debounceTime);
      }
    }
  );

  return {
    filteredOptionsStore: state,
    actions: { filterOptions, clearFilter },
  };
}

export type { FilteredOptionsStoreConfig, FilteredOptionsStore };
export { useFilteredOptionsStore };

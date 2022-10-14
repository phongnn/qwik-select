import { useStore, $, PropFunction, QRL } from "@builder.io/qwik";

import { OptionLabelKey } from "./types";

interface FilteredOptionsStore<Option> {
  options: Option[];
  loading: boolean;
}

function useFilteredOptionsStore<Option>(config: {
  options: Option[];
  optionLabelKey: OptionLabelKey<Option>;
}) {
  const state = useStore<FilteredOptionsStore<Option>>({
    options: [],
    loading: false,
  });

  const clearFilter = $(() => {
    state.options = [];
  });

  const filterOptions = $(
    async (
      query: string,
      filterSelectedOptions?: QRL<(options: Option[]) => Option[]>
    ) => {
      const { optionLabelKey } = config;
      const filteredOptions = config.options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : (opt[optionLabelKey] as string);
        return label.toLowerCase().includes(query.toLowerCase());
      });

      state.options = filterSelectedOptions
        ? await filterSelectedOptions(filteredOptions)
        : filteredOptions;
    }
  );

  return {
    filteredOptionsStore: state,
    actions: { filterOptions, clearFilter },
  };
}

function useAsyncFilteredOptionsStore<Option>(config: {
  fetcher: PropFunction<(text: string) => Promise<Option[]>>;
}) {
  const state = useStore<FilteredOptionsStore<Option>>({
    options: [],
    loading: false,
  });
  const internalState = useStore<{ lastQuery?: string }>({});

  const clearFilter = $(() => {
    state.options = [];
    state.loading = false;
  });

  const filterOptions = $(
    async (
      query: string,
      filterSelectedOptions?: QRL<(options: Option[]) => Option[]>
    ) => {
      const { fetcher } = config;
      state.options = [];
      state.loading = true;
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
    }
  );

  return {
    filteredOptionsStore: state,
    actions: { filterOptions, clearFilter },
  };
}

export type { FilteredOptionsStore };
export { useFilteredOptionsStore, useAsyncFilteredOptionsStore };

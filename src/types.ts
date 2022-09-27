import { PropFunction } from "@builder.io/qwik";

export type SelectOption = any;

export interface SelectProps {
  options?: SelectOption[];
  value?: SelectOption;
  fetchOptions$?: PropFunction<(text: string) => Promise<SelectOption[]>>;
  onChange$?: PropFunction<(value: SelectOption | undefined) => void>;
  onClear$?: PropFunction<() => void>;
  onInput$?: PropFunction<(text: string) => any>;
  onFocus$?: PropFunction<() => any>;
  onBlur$?: PropFunction<() => any>;
  disabled?: boolean;
  optionLabelKey?: string;
  placeholder?: string;
  noOptionsMessage?: string;
  inputDebounceTime?: number;
}

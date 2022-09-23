import { PropFunction } from "@builder.io/qwik";

export type SelectOption = any;

export interface SelectProps {
  options: SelectOption[];
  value?: SelectOption;
  onChange$?: PropFunction<(value: SelectOption | undefined) => void>;
  onClear$?: PropFunction<() => void>;
  disabled?: boolean;
  optionLabelKey?: string;
  placeholder?: string;
  noOptionsMessage?: string;
}

export type OptionLabelKey<Option> = Option extends string
  ? never
  : keyof Option;

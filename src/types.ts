export type SelectOption = string | { value: string; label: string };
export interface SelectState {
  isOpen: boolean;
  hoveredOption?: SelectOption;
}

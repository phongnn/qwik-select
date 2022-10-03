import { MutableWrapper, PropFunction } from "@builder.io/qwik";

import { SelectOption } from "../types";

interface MenuItemProps {
  option: SelectOption;
  getOptionLabel: (opt: SelectOption) => string;
  isSelected: MutableWrapper<boolean>;
  isHovered: MutableWrapper<boolean>;
  onClick$: PropFunction<() => void>;
}

export const MenuItem = (props: MenuItemProps) => {
  return (
    <div
      class="qs-item"
      onClick$={props.onClick$}
      data-selected={props.isSelected.mut.toString()}
      data-hovered={props.isHovered.mut.toString()}
    >
      {props.getOptionLabel(props.option)}
    </div>
  );
};

export default MenuItem;

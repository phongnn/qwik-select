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
  const { option, getOptionLabel, isHovered, isSelected } = props;
  // prettier-ignore
  const classes = `qs-item ${isSelected.mut ? "qs-selected" : ""} ${isHovered.mut ? "qs-hovered" : ""}`

  return (
    <div class={classes} onClick$={props.onClick$}>
      {getOptionLabel(option)}
    </div>
  );
};

export default MenuItem;

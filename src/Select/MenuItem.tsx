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
  const label = getOptionLabel(option);
  // prettier-ignore
  const classes = `item ${isSelected.v ? "selected" : ""} ${isHovered.v ? "hover" : ""}`

  return (
    <div class={classes} onClick$={props.onClick$}>
      {label}
    </div>
  );
};

export default MenuItem;

import { MutableWrapper, PropFunction } from "@builder.io/qwik";

import { SelectOption } from "../types";

interface MenuItemProps {
  option: SelectOption;
  isOptionHovered: MutableWrapper<(opt: SelectOption) => boolean>;
  getOptionLabel: (opt: SelectOption) => string;
  onClick$: PropFunction<() => void>;
}

export const MenuItem = (props: MenuItemProps) => {
  const { option, isOptionHovered, getOptionLabel } = props;
  const classes = `item ${isOptionHovered.v(option) ? "hover" : ""}`;
  const label = getOptionLabel(option);

  return (
    <div class={classes} onClick$={props.onClick$}>
      {label}
    </div>
  );
};

export default MenuItem;

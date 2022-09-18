import { MutableWrapper } from "@builder.io/qwik";

import { SelectOption } from "../types";

interface ListItemProps {
  data: SelectOption;
  isOptionHovered: MutableWrapper<(opt: SelectOption) => boolean>;
  getOptionLabel: (opt: SelectOption) => string;
}

export const ListItem = (props: ListItemProps) => {
  const { data, isOptionHovered, getOptionLabel } = props;
  const classes = `item ${isOptionHovered.v(data) ? "hover" : ""}`;
  const label = getOptionLabel(data);
  return <div class={classes}>{label}</div>;
};

export default ListItem;

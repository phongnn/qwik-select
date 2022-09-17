import { SelectOption, SelectState } from "../types";

interface ListItemProps {
  data: SelectOption;
  selectState: SelectState;
}

export const ListItem = ({ data, selectState }: ListItemProps) => {
  const isHovered = data === selectState.hoveredOption;
  const classes = `item ${isHovered ? "hover" : ""}`;
  const label = typeof data === "string" ? data : data.label;
  return <div class={classes}>{label}</div>;
};

export default ListItem;

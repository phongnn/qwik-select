import { SelectOption } from "../types";

interface ListItemProps {
  data: SelectOption;
  hoveredOptionStore: {
    value?: SelectOption;
  };
}

export const ListItem = ({ data, hoveredOptionStore }: ListItemProps) => {
  const isHovered = data === hoveredOptionStore.value;
  const classes = `item ${isHovered ? "hover" : ""}`;
  const label = typeof data === "string" ? data : data.label;
  return <div class={classes}>{label}</div>;
};

export default ListItem;

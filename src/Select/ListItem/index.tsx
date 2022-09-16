import { component$, useStyles$ } from "@builder.io/qwik";

import { SelectOption, SelectState } from "../../types";
import styles from "./item.css?inline";

interface ListItemProps {
  data: SelectOption;
  selectState: SelectState;
}

export const ListItem = component$(({ data, selectState }: ListItemProps) => {
  useStyles$(styles);

  const isHovered = data === selectState.hoveredOption;
  const classes = `item ${isHovered ? "hover" : ""}`;
  const label = typeof data === "string" ? data : data.label;
  return <div class={classes}>{label}</div>;
});

export default ListItem;

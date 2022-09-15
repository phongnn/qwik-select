import { component$, useStyles$ } from "@builder.io/qwik";

import { SelectOption } from "../../types";
import styles from "./item.css?inline";

interface ListItemProps {
  data: SelectOption;
  isHovered: boolean;
}

export const ListItem = component$(({ data, isHovered }: ListItemProps) => {
  useStyles$(styles);
  const label = typeof data === "string" ? data : data.label;
  const classes = `item ${isHovered ? "hover" : ""}`;
  return <div class={classes}>{label}</div>;
});

export default ListItem;

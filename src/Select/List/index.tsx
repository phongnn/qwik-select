import { component$, useStyles$, JSXNode } from "@builder.io/qwik";

import { SelectOption } from "../../types";
import styles from "./list.css?inline";

export interface ListProps {
  items: SelectOption[];
  renderItem: (item: SelectOption) => JSXNode;
}

const List = component$((props: ListProps) => {
  useStyles$(styles);
  return (
    <div class="list">{props.items.map((it) => props.renderItem(it))}</div>
  );
});

export default List;

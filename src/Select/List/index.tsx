import { component$, useStyles$ } from "@builder.io/qwik";

import { SelectOption } from "../../types";
import styles from "./list.css?inline";

export interface ListProps {
  items: SelectOption[];
}

const List = component$((props: ListProps) => {
  useStyles$(styles);
  return (
    <div class="list">
      {props.items.map((opt) => (
        <Item data={opt} />
      ))}
    </div>
  );
});

interface ItemProps {
  data: SelectOption;
}

export const Item = ({ data }: ItemProps) => {
  const label = typeof data === "string" ? data : data.label;
  return <div class="item">{label}</div>;
};

export default List;

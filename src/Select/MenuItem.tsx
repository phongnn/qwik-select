import { PropFunction } from "@builder.io/qwik";

interface MenuItemProps<Option> {
  option: Option;
  getOptionLabel: (opt: Option) => string;
  isSelected: boolean;
  isHovered: boolean;
  onClick$: PropFunction<() => void>;
}

function MenuItem<Option>(props: MenuItemProps<Option>) {
  return (
    <div
      class="qs-item"
      onClick$={props.onClick$}
      data-selected={props.isSelected.toString()}
      data-hovered={props.isHovered.toString()}
    >
      {props.getOptionLabel(props.option)}
    </div>
  );
}

export default MenuItem;

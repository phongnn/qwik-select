import { MutableWrapper, PropFunction } from "@builder.io/qwik";

interface MenuItemProps<Option> {
  option: Option;
  getOptionLabel: (opt: Option) => string;
  isSelected: MutableWrapper<boolean>;
  isHovered: MutableWrapper<boolean>;
  onClick$: PropFunction<() => void>;
}

function MenuItem<Option>(props: MenuItemProps<Option>) {
  return (
    <div
      class="qs-item"
      onClick$={props.onClick$}
      data-selected={props.isSelected.mut.toString()}
      data-hovered={props.isHovered.mut.toString()}
    >
      {props.getOptionLabel(props.option)}
    </div>
  );
}

export default MenuItem;

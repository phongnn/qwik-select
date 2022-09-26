export function scrollToItem(
  listElem: HTMLElement | undefined,
  selector: string
) {
  const itemElement = listElem?.querySelector(selector);
  itemElement?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

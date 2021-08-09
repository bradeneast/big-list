import checklist from "./_state";
import { $$, hide } from "./_utils";

export default function handleGlobalClick(event) {

  let { target } = event;

  if (target == checklist.element) {
    let lastItem = checklist.items[checklist.items.length - 1];
    if (lastItem.name.length)
      checklist.addItem();
  }

  if (target.classList.contains("cancel"))
    $$(".modal").forEach(modal => hide(modal));
}
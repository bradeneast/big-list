import { Item } from "./_classes";
import checklist from "./_state";

export function handleKeydown(event, item) {

  let target = event.target;
  let value = target.value;
  let cursorPosition = target.selectionEnd;
  let currentItemIndex = checklist.items.indexOf(item);
  let prevIndex = currentItemIndex - 1;
  let nextIndex = currentItemIndex + 1;

  switch (event.key) {
    case "Backspace":
      if (cursorPosition === 0 && checklist.items.length > 1) {
        event.preventDefault();
        let previousItem = checklist.items[prevIndex];
        let previousItemName = previousItem ? previousItem.name : "";
        if (previousItem) {
          previousItem.name = previousItemName + value;
          checklist.focusTo(prevIndex, previousItemName.length);
        } else
          checklist.focusTo(currentItemIndex, 0);
        item.delete();
      }
      break;
    case "Enter":
      let newItemName = value.slice(cursorPosition);
      let newItemIndex = currentItemIndex + 1;
      item.name = value.substr(0, cursorPosition);
      checklist.addItem(new Item({ name: newItemName }), newItemIndex);
      checklist.focusTo(newItemIndex, 0);
      break;
    case "ArrowUp":
      if (!checklist.items[prevIndex]) break;
      event.preventDefault();
      checklist.focusTo(prevIndex, cursorPosition);
      break;
    case "ArrowDown":
      if (!checklist.items[nextIndex]) break;
      event.preventDefault();
      checklist.focusTo(nextIndex, cursorPosition);
      break;
  }
}
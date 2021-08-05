import { Item } from "./_classes";
import checklist from "./_state";

let ctrl = false;
let shift = false;

export function handleGlobalKeydown(event) {
  switch (event.key) {
    case "z": if (ctrl) checklist.undo(); break;
    case "Z": if (ctrl && shift) checklist.redo(); break;
    case "Control": ctrl = true; break;
    case "Shift": shift = true; break;
  }
}

export function handleGlobalKeyup(event) {
  switch (event.key) {
    case "Control": ctrl = false; break;
    case "Shift": shift = false; break;
  }
}

export function handleItemKeydown(event, item) {

  let target = event.target;
  let value = target.value;
  let cursorPosition = target.selectionEnd;
  let currentItemIndex = checklist.items.indexOf(item);
  let prevIndex = currentItemIndex - 1;
  let nextIndex = currentItemIndex + 1;

  switch (event.key) {
    case "Delete":
      if (cursorPosition == value.length) {
        let nextItem = checklist.items[nextIndex];
        item.setName(item.name + nextItem.name);
        nextItem.delete();
        checklist.focusTo(currentItemIndex, cursorPosition);
      }
      break;
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
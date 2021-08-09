import checklist from "./_state";
import { $$, hide } from "./_utils";
import { Item } from "./_classes";
import render from "./_render";


let ctrl = false;
let shift = false;
let holding = false;
let holdingWaiter;
let itemNewIndex = 0;
let startHoldingWaiter = element => holdingWaiter = setTimeout(() => holding = element, 250);


export function dragStart(event) {
  startHoldingWaiter(event.target.closest("li"));
}


export function dragMove(event) {
  requestAnimationFrame(() => {
    if (!holding) return;
    document.documentElement.classList.add("noscroll");
    itemNewIndex = 0;

    let isTouch = event.touches;
    let pointerPositionY = isTouch ? event.touches[0].pageY : event.clientY;

    holding.classList.add("drug");

    for (let itemElement of $$("li:not(.drug)")) {
      let rect = itemElement.getBoundingClientRect();
      let rectMiddle = rect.top + rect.height / 2;
      let pointerIsAbove = rectMiddle > pointerPositionY;
      itemElement.classList.toggle("shift", pointerIsAbove);
      if (!pointerIsAbove) itemNewIndex += 1;
    }
  })
}


export function dragEnd() {

  if (holding) {

    let item = checklist.items.find(item => item.id == holding.id);
    let itemOldIndex = checklist.items.indexOf(item);

    checklist.items.splice(itemOldIndex, 1);
    checklist.items.splice(itemNewIndex, 0, item);

    render();

    document.activeElement.focus();
    document.activeElement.blur();
  }

  // Clear stuff
  clearTimeout(holdingWaiter);
  document.documentElement.classList.remove("noscroll");
  $$("li").forEach(itemElement => itemElement.className = "");
  holding = false;
}


export function globalKeydown(event) {
  switch (event.key) {
    case "z": if (ctrl) checklist.undo(); break;
    case "Z": if (ctrl && shift) checklist.redo(); break;
    case "Control": ctrl = true; break;
    case "Shift": shift = true; break;
  }
}


export function globalKeyup(event) {
  switch (event.key) {
    case "Control": ctrl = false; break;
    case "Shift": shift = false; break;
  }
}


export function itemKeydown(event, item) {

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


export function globalClick({ target }) {

  if (target == checklist.element && checklist.items[checklist.items.length - 1].name.length)
    checklist.addItem();

  if (target.classList.contains("cancel"))
    $$(".modal").forEach(modal => hide(modal));
}
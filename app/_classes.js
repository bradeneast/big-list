import render from "./_render";
import checklist from "./_state";
import { ls, random, $ } from "./_utils";

export class Checklist {
  constructor(element, items) {
    this.element = element;
    this.items = items || [];
  }

  save() {
    ls("checklist", this.items);
  }

  focusTo(index, cursorPosition) {
    setTimeout(() => {
      let itemElement = $(this.items[index].id);
      let itemNameInput = itemElement.querySelector(`input[type="text"]`);
      itemNameInput.focus();
      itemNameInput.setSelectionRange(cursorPosition, cursorPosition);
    }, 5);
  }

  addItem(item = new Item(), index = this.items.length) {
    this.items.splice(index, 0, item);
    render();
    this.focusTo(index);
  }
}

export class Item {
  constructor(options = {}) {
    this.id = random();
    this.name = options.name || "";
    this.done = options.done || false;
  }

  delete() {
    let index = checklist.items.indexOf(this);
    checklist.items.splice(index, 1);
    render();
  }
}
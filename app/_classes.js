import render from "./_render";
import checklist from "./_state";
import { ls, random, $, createDownload, deepCopy } from "./_utils";


let saveLatency = 250;
let saveWaiter = setTimeout(saveChecklist, saveLatency);

function saveChecklist() {

  const exportLink = $("export");
  exportLink.href = createDownload(checklist);
  exportLink.download = `big_list_${new Date().toLocaleDateString()}.json`;

  // Save to localStorage
  ls("checklist", checklist.items);

  // Update history
  let { states, index } = checklist.history;
  let isNewestVersion = states.length - 1 == index;
  if (isNewestVersion) checklist.makeHistory();
}

export class Checklist {
  constructor(element, items) {
    this.element = element;
    this.items = items || [];
    this.history = { index: 0, states: [deepCopy(this.items)] };
  }

  initializeItems(items) {
    this.items = items.map(item => new Item(item));
  }

  makeHistory() {
    let { history, items } = this;
    let { states, index } = history;
    // Ensure current history state matches newest version
    if (states.length - 1 != index) {
      history.states = states.slice(index);
      history.index = states.length - 1;
    }
    // Start dropping items off start of array to save memory
    if (history.states.length > 50)
      history.states.splice(0, 1);

    // Add new entry to history
    history.states.push(deepCopy(items));
    // Increment history index
    history.index++;
  }

  undo() {
    let { states, index } = this.history;
    let newState = states[index - 1];
    if (newState) {
      this.initializeItems(newState);
      this.history.index = index - 1;
      render();
    }
  }

  redo() {
    let { states, index } = this.history;
    let newState = states[index + 1];
    if (newState) {
      this.initializeItems(newState);
      this.history.index = index + 1;
      render();
    }
  }

  save() {
    clearTimeout(saveWaiter);
    saveWaiter = setTimeout(saveChecklist, saveLatency);
  }

  focusTo(itemIndex, cursorPosition) {
    setTimeout(() => {
      let itemElement = $(this.items[itemIndex].id);
      let itemNameInput = itemElement.querySelector(`input[type="text"]`);
      itemNameInput.focus();
      itemNameInput.setSelectionRange(cursorPosition, cursorPosition);
    }, 10);
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

  setName(name) {
    this.name = name;
    checklist.save();
  }

  setDone(done) {
    this.done = done;
    checklist.save();
  }

  delete() {
    let index = checklist.items.indexOf(this);
    checklist.items.splice(index, 1);
    render();
  }
}
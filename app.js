const $ = id => document.getElementById(id);
const $$ = selector => document.querySelectorAll(selector);
const checklistElement = $('checklist');
const defaultTheme = 'day';

let holding = false;
let holdingWaiter;
let itemNewIndex = 0;
let startHoldingWaiter = element => holdingWaiter = setTimeout(() => holding = element, 150);


function handleTouchStart(event) {
  startHoldingWaiter(event.target.closest('li'));
}

function handleTouchMove(event) {
  requestAnimationFrame(() => {

    if (!holding) return;
    document.documentElement.classList.add('noscroll');
    itemNewIndex = 0;

    let isTouch = event.touches;
    let pointerPositionY = isTouch ? event.touches[0].pageY : event.clientY;

    holding.classList.add('drug');

    for (let itemElement of $$('li:not(.drug)')) {
      let rect = itemElement.getBoundingClientRect();
      let rectMiddle = rect.top + rect.height / 2;
      let pointerIsAbove = rectMiddle > pointerPositionY;
      itemElement.classList.toggle("shift", pointerIsAbove);
      if (!pointerIsAbove) itemNewIndex += 1;
    }
  })
}

function handleTouchEnd(event) {

  if (holding) {
    let item = checklist.items.find(item => item.id == holding.id);
    let itemOldIndex = checklist.items.indexOf(item);
    checklist.items.splice(itemOldIndex, 1);
    checklist.items.splice(itemNewIndex, 0, item);
    render();
  }

  // Clear stuff
  clearTimeout(holdingWaiter);
  document.documentElement.classList.remove('noscroll');
  $$('li').forEach(itemElement => itemElement.className = '');
  holding = false;
}


class Checklist {
  constructor(element, items) {
    this.element = element;
    this.items = items || [];
  }

  save() {
    localStorage.setItem('checklist', JSON.stringify(this.items));
  }

  focusTo(index, cursorPosition) {
    setTimeout(() => {
      let itemElement = $(this.items[index].id);
      let itemNameInput = itemElement.querySelector('input[type="text"]')
      itemNameInput.focus();
      itemNameInput.setSelectionRange(cursorPosition, cursorPosition);
    },
      20
    );
  }

  addItem(item = new Item(), index = this.items.length) {
    this.items.splice(index, 0, item);
    render();
    this.focusTo(index);
  }
}


class Item {
  constructor(options = {}) {
    this.id = Math.round(new Date().getTime() / Math.random());
    this.name = options.name || '';
    this.done = options.done || false;
  }

  setDone(isDone) {
    this.done = isDone;
  }

  toggleDone() {
    this.setDone(!this.done);
  }

  rename(name) {
    this.name = name;
  }

  delete() {
    let index = checklist.items.indexOf(this);
    checklist.items.splice(index, 1);
    render();
  }
}


function render() {

  checklist.element.innerHTML = '';

  checklist.items.forEach((item, index) => {

    let element = document.createElement('li');
    element.id = item.id;

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.oninput = event => item.toggleDone(event.target.checked);
    checkbox.onmousedown = handleTouchStart;
    checkbox.ontouchstart = handleTouchStart;

    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = item.name;
    nameInput.placeholder = 'Untitled';
    nameInput.oninput = event => item.rename(event.target.value);

    nameInput.onkeydown = event => {

      let target = event.target;
      let value = target.value;
      let cursorPosition = target.selectionEnd;
      let currentItemIndex = checklist.items.indexOf(item);
      let previousItemIndex = currentItemIndex - 1;
      let nextItemIndex = currentItemIndex + 1;

      switch (event.key) {
        case "Backspace":
          if (cursorPosition === 0) {
            let previousItem = checklist.items[previousItemIndex];
            let previousItemName = previousItem ? previousItem.name : '';
            if (previousItem)
              previousItem.rename(previousItemName + value);
            item.delete();
            if (previousItem)
              checklist.focusTo(previousItemIndex, previousItemName.length);
          }
          break;
        case "Enter":
          let newItemName = value.slice(cursorPosition);
          let newItemIndex = currentItemIndex + 1;
          item.rename(value.substr(0, cursorPosition));
          checklist.addItem(new Item({ name: newItemName }), newItemIndex);
          checklist.focusTo(newItemIndex, 0);
          break;
        case "ArrowUp":
          event.preventDefault();
          let previousItem = checklist.items[previousItemIndex];
          if (previousItem) checklist.focusTo(previousItemIndex, cursorPosition);
          break;
        case "ArrowDown":
          event.preventDefault();
          let nextItem = checklist.items[nextItemIndex];
          if (nextItem) checklist.focusTo(nextItemIndex, cursorPosition);
          break;
      }
    }

    element.append(checkbox);
    element.append(nameInput);
    checklist.element.append(element);
    checklist.save();
  })
}


const locallySavedChecklist = localStorage.getItem('checklist');
const locallySavedTheme = localStorage.getItem('theme');
const initialItems = locallySavedChecklist
  ? JSON.parse(locallySavedChecklist).map(opts => new Item(opts))
  : [new Item()];
const checklist = new Checklist(checklistElement, initialItems);

document.body.classList.add(locallySavedTheme || defaultTheme);

$$('[data-theme]').forEach(btn => btn.addEventListener('click', () => {
  let theme = btn.getAttribute('data-theme');
  document.body.className = theme;
  localStorage.setItem('theme', theme)
}))

addEventListener('beforeunload', () => checklist.save());
addEventListener('touchmove', handleTouchMove);
addEventListener('mousemove', handleTouchMove);
addEventListener('mouseup', handleTouchEnd);
addEventListener('touchend', handleTouchEnd);


render();

setInterval(() => checklist.save(), 1000);
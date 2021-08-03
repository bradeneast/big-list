// HELPERS //
const $ = id => document.getElementById(id);
const $$ = selector => document.querySelectorAll(selector);
const elem = (tagname, attributes = {}, children = []) => {
  let result = document.createElement(tagname);
  Object.entries(attributes).map(([key, value]) => result[key] = value);
  children.map(child => result.append(child));
  return result;
}
const ls = (key, value) => {
  try {
    value == undefined
      ? JSON.parse(localStorage.getItem(key))
      : localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

// DECLARING THINGS //
const checklistElement = $("checklist");
const defaultTheme = "day";

// DRAGGING THINGS //
let holding = false;
let holdingWaiter;
let itemNewIndex = 0;
let startHoldingWaiter = element => holdingWaiter = setTimeout(() => holding = element, 150);


function handleTouchStart(event) {
  startHoldingWaiter(event.target.closest("li"));
}


function handleTouchMove(event) {
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
  document.documentElement.classList.remove("noscroll");
  $$("li").forEach(itemElement => itemElement.className = "");
  holding = false;
}


function handleKeydown(event, item) {

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
        if (previousItem)
          previousItem.rename(previousItemName + value);
        item.delete();
        if (previousItem)
          checklist.focusTo(prevIndex, previousItemName.length);
        else
          checklist.focusTo(currentItemIndex, 0);
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
      if (checklist.items[prevIndex])
        checklist.focusTo(prevIndex, cursorPosition);
      break;
    case "ArrowDown":
      event.preventDefault();
      if (checklist.items[nextIndex])
        checklist.focusTo(nextIndex, cursorPosition);
      break;
  }
}


// SETTING UP THINGS //
class Checklist {
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
    },
      5
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
    this.name = options.name || "";
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


// RENDERING THINGS //
function render() {
  checklist.element.innerHTML = "";
  checklist.items.forEach((item, index) => {
    // Checkbox
    let checkbox = elem("input", { type: "checkbox", checked: item.done });
    checkbox.oninput = event => item.toggleDone(event.target.checked);
    checkbox.onmousedown = handleTouchStart;
    checkbox.ontouchstart = handleTouchStart;
    // Text input
    let nameInput = elem("input", { type: "text", value: item.name, placeholder: "Untitled" });
    if (index == 0) nameInput.autofocus = true;
    nameInput.oninput = event => item.rename(event.target.value);
    nameInput.onkeydown = event => handleKeydown(event, item);
    // List item parent element
    let itemElement = elem("li", { id: item.id }, [checkbox, nameInput]);
    checklist.element.append(itemElement);
    checklist.save();
  })
}



// INITIALIZING THINGS //

// CHECKLIST
const recovered = ls("checklist");
const initialItems = recovered ? recovered.map(opts => new Item(opts)) : [new Item()];
const checklist = new Checklist(checklistElement, initialItems);

// THEME
const currentTheme = ls("theme");
const themeToggles = $$("[data-theme]");
document.body.classList.add(currentTheme || defaultTheme);
// Listen for theme change
themeToggles.forEach(btn => btn.onclick = () => {
  let theme = btn.getAttribute("data-theme");
  document.body.className = theme;
  ls("theme", theme);
})


// LISTEN FOR DRAGGING
ontouchmove = handleTouchMove;
onmousemove = handleTouchMove;
ontouchend = handleTouchEnd;
onmouseup = handleTouchEnd;


// SAVING THINGS
// addEventListener("beforeunload", () => checklist.save());
// setInterval(() => checklist.save(), 1000);


// RENDER
render();
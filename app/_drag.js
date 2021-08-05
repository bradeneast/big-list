import render from "./_render";
import checklist from "./_state";
import { $$ } from "./_utils";

let holding = false;
let holdingWaiter;
let itemNewIndex = 0;
let startHoldingWaiter = element => holdingWaiter = setTimeout(() => holding = element, 250);

export default drag = {
  started(event) {
    startHoldingWaiter(event.target.closest("li"));
  },

  moved(event) {
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
  },

  ended() {
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
}
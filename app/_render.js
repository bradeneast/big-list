import * as handle from "./_handlers";
import checklist from "./_state";
import { elem } from "./_utils";

export default render = () => {

  checklist.element.innerHTML = "";

  checklist.items.forEach((item, index) => {

    // Checkbox
    let checkbox = elem("input", { type: "checkbox", checked: item.done });
    checkbox.oninput = event => item.setDone(event.target.checked);
    checkbox.onmousedown = handle.dragStart;
    checkbox.ontouchstart = handle.dragStart;
    checkbox.onblur = checklist.trim;

    // Text input
    let nameInput = elem("input", { type: "text", value: item.name, placeholder: "Untitled" });
    if (index == 0) nameInput.autofocus = true;
    nameInput.oninput = event => item.setName(event.target.value);
    nameInput.onkeydown = event => handle.itemKeydown(event, item);
    nameInput.onblur = checklist.trim;

    // List item parent element
    let itemElement = elem("li", { id: item.id }, [checkbox, nameInput]);
    checklist.element.append(itemElement);
    checklist.save();
  })
}
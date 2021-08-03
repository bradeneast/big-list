import { handleKeydown } from "./_keystrokes";
import checklist from "./_state";
import { createDownload, elem, $, random } from "./_utils";

const exportLink = $("export");

export default render = () => {
  exportLink.href = createDownload(checklist);
  exportLink.download = `big_list_${new Date().toLocaleDateString()}.json`;
  checklist.element.innerHTML = "";
  checklist.items.forEach((item, index) => {
    // Checkbox
    let checkbox = elem("input", { type: "checkbox", checked: item.done });
    checkbox.oninput = event => item.done = event.target.checked;
    checkbox.onmousedown = drag.started;
    checkbox.ontouchstart = drag.started;
    // Text input
    let nameInput = elem("input", { type: "text", value: item.name, placeholder: "Untitled" });
    if (index == 0) nameInput.autofocus = true;
    nameInput.oninput = event => item.name = event.target.value;
    nameInput.onkeydown = event => handleKeydown(event, item);
    // List item parent element
    let itemElement = elem("li", { id: item.id }, [checkbox, nameInput]);
    checklist.element.append(itemElement);
    checklist.save();
  })
}
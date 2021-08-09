import { Item } from "./_classes";
import render from "./_render";
import checklist from "./_state";
import { $, show, hide, createDownload } from "./_utils";


let importedList = [];


/** Launches a dialogue to choose how items should be imported */
function configureImport() {

  let dialogue = $("import_config");
  show(dialogue);

  function importItems() {
    importedList.map(opts => checklist.items.push(new Item(opts)));
    hide(dialogue)
    render();
  }

  $("combine").onclick = importItems
  $("replace").onclick = () => {
    checklist.items = [];
    importItems();
  }
}


/** Imports JSON data */
export function handleFileImport(event) {

  let file;
  let reader = new FileReader();

  if (event.dataTransfer?.items) {
    event.preventDefault();
    file = event.dataTransfer.items[0].getAsFile();
  }
  else if (event.dataTransfer) {
    event.preventDefault();
    file = event.dataTransfer.files[0];
  }
  else file = event.target.files[0];

  reader.onerror = err => alert("error importing list: " + err);
  reader.onload = function () {
    importedList = JSON.parse(this.result);
    configureImport();
  }

  reader.readAsText(file);
}

export function handlePasteImport(event) {

  let dialogue = $("paste_dialogue");
  let textarea = dialogue.querySelector("textarea");
  show(dialogue);

  $("import_pasted").onclick = () => {
    try {
      importedList = JSON.parse(textarea.value);
    } catch (err) {
      importedList = textarea.value
        .split("\n")
        .map(line => new Item({ name: line }));
    }
    hide(dialogue);
    configureImport();
  }
}

export function makeExport() {
  const exportLink = $("export");
  exportLink.href = createDownload(checklist.items);
  exportLink.download = `big_list_${new Date().toLocaleDateString()}.json`;
}
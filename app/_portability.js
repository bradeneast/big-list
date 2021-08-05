import { Item } from './_classes';
import render from './_render';
import checklist from './_state';
import { $, show, hide } from './_utils';

let importedList = [];

/** Launches a dialogue to choose how items should be imported */
const configureImport = () => {

  let dialogue = $('configureImportDialogue');
  show(dialogue);

  function importItems() {
    importedList.map(opts => checklist.items.push(new Item(opts)));
    hide(dialogue)
    render();
  }

  $('combine').onclick = importItems
  $('replace').onclick = () => {
    checklist.items = [];
    importItems();
  }
}

/** Imports JSON data */
export const handleFileImport = event => {

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

  reader.onerror = err => alert(`Error importing list: ${err}`);
  reader.onload = function () {
    importedList = JSON.parse(this.result).items;
    configureImport();
  }

  reader.readAsText(file);
}

export const handlePasteImport = event => {

  let dialogue = $('pasteImportDialogue');
  let textarea = dialogue.querySelector('textarea');
  show(dialogue);

  $('importPastedText').onclick = () => {
    try {
      importedList = JSON.parse(textarea.value).items;
    } catch (err) {
      console.log("Error parsing JSON. Importing as plain text.");
      let lines = textarea.value.split('\n');
      importedList = lines.map(line => new Item({ name: line }));
    }
    hide(dialogue);
    configureImport();
  }
}
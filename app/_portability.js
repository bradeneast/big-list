import { Item } from './_classes';
import render from './_render';
import checklist from './_state';
import { $ } from './_utils';

let importedList = [];

/** Launches a dialogue to choose how items should be imported */
const configureImport = () => {

  let modal = $('modal');
  let importItems = () => {
    importedList.map(opts => checklist.items.push(new Item(opts)));
    modal.classList.add('invisible');
    render();
  }

  modal.classList.remove('invisible');

  $('combine').onclick = importItems;
  $('replace').onclick = () => {
    checklist.items = [];
    importItems();
  }
}

/** Imports JSON data */
export const handleImport = event => {

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
import { $, $$, ls } from './_utils';
import checklist from "./_state";
import render from './_render';
import { handleFileImport, handlePasteImport } from './_portability';
import * as handle from './_handlers';

const currentTheme = ls("theme");
const themeToggles = $$("[data-theme]");
const importFileInput = $('import_file');
const importPasteButton = $('import_paste');

// THEME
document.body.classList.add(currentTheme);
// Listen for theme change
themeToggles.forEach(btn => btn.onclick = () => {
  let theme = btn.getAttribute("data-theme");
  document.body.className = theme;
  ls("theme", theme);
})

// LISTEN FOR THINGS
// Click
onclick = handle.globalClick;
ontouchstart = handle.globalClick;
// Keystroks
onkeydown = handle.globalKeydown;
onkeyup = handle.globalKeyup;
// Dragging
ontouchmove = handle.dragMove;
onmousemove = handle.dragMove;
ontouchend = handle.dragEnd;
onmouseup = handle.dragEnd;
// Importing
importFileInput.oninput = handleFileImport;
importPasteButton.onclick = handlePasteImport;
// Leaving
onbeforeunload = checklist.save;

// RENDER
render();
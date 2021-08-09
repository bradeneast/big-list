import { $, $$, ls } from './_utils';
import checklist from "./_state";
import render from './_render';
import drag from './_drag';
import { handleFileImport, handlePasteImport } from './_portability';
import { handleGlobalKeydown, handleGlobalKeyup } from './_keystrokes';
import handleGlobalClick from './_clicks';

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
onclick = handleGlobalClick;
ontouchstart = handleGlobalClick;
// Keystroks
onkeydown = handleGlobalKeydown;
onkeyup = handleGlobalKeyup;
// Dragging
ontouchmove = drag.moved;
onmousemove = drag.moved;
ontouchend = drag.ended;
onmouseup = drag.ended;
// Importing
importFileInput.oninput = handleFileImport;
importPasteButton.onclick = handlePasteImport;
// Leaving
onbeforeunload = checklist.save;

// RENDER
render();
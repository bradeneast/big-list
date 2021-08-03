import { $, $$, ls } from './_utils';
import checklist from "./_state";
import render from './_render';
import drag from './_drag';
import { handleImport } from './_portability';


// THEME
const currentTheme = ls("theme");
const themeToggles = $$("[data-theme]");
document.body.classList.add(currentTheme);

// Listen for theme change
themeToggles.forEach(btn => btn.onclick = () => {
  let theme = btn.getAttribute("data-theme");
  document.body.className = theme;
  ls("theme", theme);
})


// LISTEN FOR DRAGGING
ontouchmove = drag.moved;
onmousemove = drag.moved;
ontouchend = drag.ended;
onmouseup = drag.ended;


// LISTEN FOR IMPORT
const importButton = $('import');
importButton.oninput = handleImport;


// SAVING THINGS
addEventListener("beforeunload", () => checklist.save());
setInterval(() => checklist.save(), 1000);


// RENDER
render();
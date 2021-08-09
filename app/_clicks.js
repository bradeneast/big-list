import checklist from "./_state";

export default function handleGlobalClick(event) {
  let lastItem = checklist.items[checklist.items.length - 1];
  if (event.target == checklist.element && lastItem.name.length)
    checklist.addItem();
}
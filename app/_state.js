import { Checklist, Item } from "./_classes";
import { ls, $ } from "./_utils";

const checklistElement = $("checklist");
const recovered = ls("checklist");
const initialItems = recovered ? recovered.map(opts => new Item(opts)) : [new Item()];
const checklist = new Checklist(checklistElement, initialItems);

export default checklist;
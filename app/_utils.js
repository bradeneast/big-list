/** Shorthand for `document.getElementById()` */
export const $ = id => document.getElementById(id);

/** Shorthand for `document.querySelectorAll()` */
export const $$ = selector => document.querySelectorAll(selector);

/** Generates a pseudo-random integer */
export const random = () => Math.round(new Date().getTime() / Math.random());

/** Creates a new element with optional attributes and children */
export const elem = (tagname, attributes = {}, children = []) => {
  let result = document.createElement(tagname);
  Object.entries(attributes).map(([key, value]) => result[key] = value);
  children.map(child => result.append(child));
  return result;
}

/** localStorage shorthand helper - gets or sets localStorage items */
export const ls = (key, value) => value === undefined
  ? JSON.parse(localStorage.getItem(key))
  : localStorage.setItem(key, JSON.stringify(value));

/** Stringifies an object and returns a temporary blob url */
export const createDownload = (item) => {
  let blob = new Blob([JSON.stringify(item)], { type: "application/json" });
  return URL.createObjectURL(blob);
}

/** Returns an unlinked deep copy of the object passed */
export const deepCopy = obj => JSON.parse(JSON.stringify(obj));

export const show = elem => elem.classList.remove("invisible");
export const hide = elem => elem.classList.add("invisible");
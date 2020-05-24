export function createStyled(tagName, classNames, ...children) {
  const elem = document.createElement(tagName);
  elem.classList.add(...classNames);
  elem.append(...children);
  return elem;
}
export function create(tagName, ...children) {
  const elem = document.createElement(tagName);
  elem.append(...children);
  return elem;
}

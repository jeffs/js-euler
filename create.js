export function createStyled(tagName, className, ...children) {
  const elem = document.createElement(tagName);
  elem.classList.add(...className.split(' '));
  elem.append(...children);
  return elem;
}

export function create(tagName, ...children) {
  const elem = document.createElement(tagName);
  elem.append(...children);
  return elem;
}

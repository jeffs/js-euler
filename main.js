import { create, createStyled } from './create.js';
import problem1 from './problem1.js';

const problems = [
  problem1(),
];

const getPane = function () {
  const panes = new Array(problems.length);
  return function (index) {
    if (!panes[index]) {
      const problem = problems[index];
      const title = createStyled(
        'h2',
        ['problem__title'],
        `${index + 1}. ${problem.title}`);
      const paragraphs = problem.paragraphs.map(s => create('p', s));
      const description = createStyled(
        'blockquote',
        ['problem__description'],
        ...paragraphs);
      const elem = problem.render();
      panes[index] = create('div', title, description, elem);
    }
    return panes[index];
  };
}();

function selectProblem(index) {
  const pane = getPane(index);
  const space = document.getElementById('problem');
  if (space.firstChild) space.firstChild.remove();
  space.append(pane);
}

function main() {
  const contents = document.getElementById('contents__list');
  contents.append(...problems.map((problem, index) => {
    const li = create('li', problem.title);
    li.addEventListener('click', () => {
      selectProblem(index);
    });
    return li;
  }));
  selectProblem(0);
}

main();

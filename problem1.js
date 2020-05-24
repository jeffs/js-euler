import { create, createStyled } from './create.js';

function renderTableHead() {
  return create(
    'thead',
    create('tr', create('th', 'multiple'), create('th', 'tally')));
}

function renderTableBodyRow([multiple, tally]) {
  return create('tr',
    createStyled('td', ['table__number'], multiple),
    createStyled('td', ['table__number'], tally));
}

function renderTableBody(rows) {
  return create('tbody', ...rows.map(renderTableBodyRow));
}

function renderTable(rows) {
  return createStyled(
    'table',
    ['table'],
    renderTableHead(),
    renderTableBody(rows));
}

export default function problem1() {
  return {
    title: 'Multiples of 3 and 5',

    paragraphs: [
      `If we list all the natural numbers below 10 that are multiples of 3 or
      5, we get 3, 5, 6 and 9. The sum of these multiples is 23.`,
      `Find the sum of all the multiples of 3 or 5 below 1000.`
    ],

    render() {
      let rows = [];
      let sum = 0;
      for (let i = 1; i < 1000; ++i) {
        if (i % 3 === 0 || i % 5 === 0) {
          sum += i;
          rows.push([i, sum]);
        }
      }
      const answer = createStyled('h3', ['problem__answer'], `Answer: ${sum}`);
      const details = renderTable(rows);
      return create('div', answer, details);
    },
  };
}

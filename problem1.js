import { create, createStyled } from './create.js';
import { filter, product, range, sum } from './range.js';

const divisors = [3, 5];
const bound = 1000;

function formatAnswer(answer) {
  return createStyled('h3', 'problem__answer', `Answer: ${answer}`);
}

function formatList(items) {
  switch (items.length) {
    case 0: return 'an empty list';
    case 1: return items[0];
    case 2: return items.join(' and ');
    default: {
      const m = items.length - 1;
      return `${items.slice(0, m).join(', ')}, and ${items[m]}`;
    }
  }
}

function render() {
  const comments = [];
  const p = (...kids) => { comments.push(create('p', ...kids)); };
  const c = (text) => { comments.push(createStyled('pre', 'math', text)); };

  // O(N)

  const divisible = (value) => divisors.some(d => value % d === 0);
  const answer = sum(filter(range(bound), divisible));
  p(`The quick and dirty way to calculate this sum is brute force.  For example, as a Python one-liner:`);
  c(`>>> sum(i for i in range(${bound}) if any(i % d == 0 for d in [${divisors.join(', ')}]))`
    + `\n${answer}`);

  // O(P), where P is the product of the divisors (presuming the number of
  // divisors is bounded)

  const period = product(divisors);
  const multiples = [...filter(range(1, period + 1), divisible)];
  const series = sum(multiples);

  function formatMultiples(index) {
    const ms = multiples.map(x => x + index * period);
    return `${ms.join(' + ')}`
      + `\n= ${multiples.map(x => `(${x} + ${index * period})`).join(' + ')}`
      + `\n= (${multiples.join(' + ')}) + (${multiples.length} * ${index * period})`
      + `\n= ${series} + ${multiples.length * index * period}`
      + `\n= ${sum(ms)}`;
  }

  p(`We can also derive a closed form solution.  Note that the sum of multiples of ${formatList(divisors)} in the closed range 1 through ${period} is ${series}:`);
  c(`${multiples.join(' + ')} = ${series}`);

  p(`The number ${period} is special because it is the product of ${formatList(divisors)}, and modular operations (like checking for divisibility) are periodic with respect to sequences of that length.  Let's call that length (${period}) the `, create('em', 'period'), `.`);
  p(`The sum of multiples in each subsequent sequence of ${period} numbers is similar to the first, except that each addend in the series is offset by some multiple of the period ${period}, such that the sum is increased by that multiple times the length of the sequence.  For example, consider the second ${period} natural numbers, ${period + 1} through ${2 * period}:`);
  c(formatMultiples(1));

  p(`And the third such sequence, ${2 * period + 1} through ${3 * period}:`);
  c(formatMultiples(2));

  p(`In fact, the sum of multiples of ${formatList(divisors)} in the Nth sequence of ${period} numbers is always the first series (${series}), plus the sequence length (${multiples.length}) times the period (${period}) times N, where N is the zero-based index of the sequence:`);

  comments.push(
    create('table',
      create('tr',
        create('th', 'range'),
        create('th', 'formula'),
        create('th', 'sum')),
      ...[0, 1, 2, 3].map(i =>
        create('tr',
          create('th', create('code', `[${period * i + 1}, ${period * (i + 1)}]`)),
          create('td', create('code', `${series} + ${multiples.length} * ${period} * ${i}`)),
          createStyled('td', 'table__number', `${series + multiples.length * period * i}`),
        ))));

  return create('div', formatAnswer(answer), ...comments);
}

export default function problem1() {
  return {
    title: 'Multiples of 3 and 5',
    description: [
      `If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.`,
      `Find the sum of all the multiples of 3 or 5 below 1000.`
    ],
    render,
  };
}

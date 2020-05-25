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
  const period = product(divisors);
  const divisible = (value) => divisors.some(d => value % d === 0);
  const series = [...filter(range(period + 1), divisible)];
  const comments = [];
  const p = (...kids) => { comments.push(create('p', ...kids)); };
  const c = (text) => { comments.push(createStyled('pre', 'math', text)); };

  const answer = sum(filter(range(bound), k => divisors.some(d => k % d === 0)));

  p(`The quick and dirty way to calculate this particular sum is brute force.
    For example, as a Python one-liner:`);
  c(`>>> sum(i for i in range(${bound})`
    + ` if any(i % d == 0 for d in [${divisors.join(', ')}]))`
    + `\n${answer}`);

  p(`We can also derive a closed form solution.  Note that the sum of multiples
    of ${formatList(divisors)} in the closed range [1, ${period}] is
    ${sum(series)}:`);
  c(`${series.join(' + ')} = ${sum(series)}`);

  p(`The number ${period} is special because it is the product of
    ${formatList(divisors)}, and modular operations (like checking for
    divisibility) are periodic with respect to sequences of that length.  Let's
    call that length (${period}) the `, create('em', 'period'), `.`);

  p(`The sum of multiples in each subsequent series of ${period} numbers is
    similar to the first, except that each addend in the series is offset by
    some multiple of ${period}, such that the sum is increased by that multiple
    times the length of the series.  For example:`);
  const series1 = series.map(x => x + period);
  c(`${series1.join(' + ')}`
    + `\n= ${series.map(x => `(${x} + ${period})`).join(' + ')}`
    + `\n= (${series.join(' + ')}) + (${series.length} * ${period})`
    + `\n= ${sum(series)} + ${series.length * period}`
    + `\n= ${sum(series1)}`);

  const series2 = series.map(x => x + 2 * period);
  c(`${series2.join(' + ')}`
    + `\n= ${series.map(x => `(${x} + ${2 * period})`).join(' + ')}`
    + `\n= (${series.join(' + ')}) + (${series.length} * ${2 * period})`
    + `\n= ${sum(series)} + ${series.length * 2 * period}`
    + `\n= ${sum(series2)}`);

  p(`In fact, the sum of multiples of ${formatList(divisors)} in the Nth series
    of ${period} numbers is always the sum of the first series
    (${sum(series)}), plus the series length (${series.length}) times the
    period (${period}) times N, where N is the zero-based index of the
    series.`);

  return create('div', formatAnswer(answer), ...comments);
}

export default function problem1() {
  return {
    title: 'Multiples of 3 and 5',
    description: [
      `If we list all the natural numbers below 10 that are multiples of 3 or
      5, we get 3, 5, 6 and 9. The sum of these multiples is 23.`,
      `Find the sum of all the multiples of 3 or 5 below 1000.`
    ],
    render,
  };
}

import { create, createStyled } from './create.js';
import { filter, product, range, sum } from './range.js';

const divisors = [3, 5];
const bound = 1000;

function formatAnswer(answer) {
  return createStyled('h3', 'problem__answer', `Answer: ${answer}`);
}

function formatList(items, sep) {
  switch (items.length) {
    case 0: return 'an empty list';
    case 1: return items[0];
    case 2: return items.join(` ${sep} `);
    default: {
      const m = items.length - 1;
      return `${items.slice(0, m).join(', ')}, ${sep} ${items[m]}`;
    }
  }
}

function render() {
  const comments = [];
  const p = (...kids) => { comments.push(create('p', ...kids)); };
  const c = (text) => { comments.push(createStyled('pre', 'math', text)); };

  const divisible = (value) => divisors.some(d => value % d === 0);
  const answer = sum(filter(range(bound), divisible));
  p(`The quick and dirty way to calculate this sum is brute force.  For example, a Python loop:`);
  c(`>>> sum(i for i in range(${bound}) if any(i % d == 0 for d in (${divisors.join(', ')})))`
    + `\n${answer}`);

  const period = product(divisors);
  const multiples = [...filter(range(1, period + 1), divisible)];
  const series = sum(multiples);
  p(`This loop iterates O(B) times, where B is the upper bound of our range: ${bound} in the original problem statement, though we can imagine calculating a similar sum for much larger values of B.  Alternatively, we can pursue an O(1) solution (or more generally O(P), where P is the product of the divisors; in this case, ${divisors.join(' * ')} = ${period}).`);

  function formatMultiples(index) {
    const ms = multiples.map(x => x + index * period);
    return `${ms.join(' + ')}`
      + `\n= ${multiples.map(x => `(${x} + ${index * period})`).join(' + ')}`
      + `\n= (${multiples.join(' + ')}) + (${multiples.length} * ${index * period})`
      + `\n= ${series} + ${multiples.length * index * period}`
      + `\n= ${sum(ms)}`;
  }

  p(`Note that the sum of numbers divisible by ${formatList(divisors, 'or')} in the closed range 1 through ${period} is ${series}:`);
  c(`${multiples.join(' + ')} = ${series}`);

  p(`The number ${period} is special because it is the product of ${formatList(divisors, 'and')}, so divisibility checks are periodic with respect to sequences of that length.  Let's call ${period} the `, create('em', 'period'), `.`);
  p(`The sum of divisibles in each subsequent sequence of ${period} numbers is similar to the first, except that each addend in the series is offset by some multiple of the period, such that the sum is increased by the period times the number of divisibles.  For example, consider the second ${period} natural numbers, ${period + 1} through ${2 * period}:`);
  c(formatMultiples(1));

  p(`And the third such sequence, ${2 * period + 1} through ${3 * period}:`);
  c(formatMultiples(2));

  const area = multiples.length * period;
  const exampleN = 4;
  p(`See how the sum is always ${series} plus some other number?  In fact, the sum of numbers divisible by ${formatList(divisors, 'or')} in the Ith sequence of ${period} numbers is always the first series (${series}), plus the number of multiples times the period times I, where I is the zero-based index of the sequence.  The number of multiples times the period is the constant ${multiples.length} * ${period} = ${area}, so the sum of N such series is ${series} * N + ${area} * (N - 1) * N / 2.  For example, consider N = ${exampleN}:`);

  comments.push(
    create('table',
      create('tr',
        create('th', 'range'),
        create('th', 'formula'),
        create('th', 'sum')),
      ...[...range(exampleN)].map(i =>
        create('tr',
          create('td', `[${period * i + 1}, ${period * (i + 1)}]`),
          create('td', `${series} + ${area} * ${i}`),
          createStyled('td', 'table__number', `${series + area * i}`),
        ))));

  p(`The value ${series} appears in each of the N rows, hence the term ${series} * N.  Likewise, if we distribute the constant ${area} over all the rows, then we have ${area} times the sum of 0 through N - 1, hence the term ${area} * (N - 1)  * N / 2.`);

  const count = Math.floor((bound - 1) / period);
  p(`We can easily determine the number N of ${period}-element subsequences to consider for a given upper bound B by dividing (and rounding down):  floor((${bound} - 1) / ${period}) = ${count}.  If there's any remainder, we can consider the final subsequence explicitly, as we did using the brute force Python loop above:`);

  c(`>>> ${series} * ${count} + ${area} * (${count} - 1) * ${count} / 2 + sum(`
    + `\n...  i for i in range(${period} * ${count} + 1, ${bound}) if any(i % d == 0 for d in (${divisors.join(', ')})))`
    + `\n${answer}.0`);

  p(`This time the complexity is O(1) instead of O(B), since the number of loop iterations is guaranteed to be less than ${period}.`);

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

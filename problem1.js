import { create, createStyled } from './create.js';
import { filter, product, range, sum } from './range.js';

const container = document.getElementById('problem-container');

const state = {
  divisors: [3, 5],
  bound: 1000,
};

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
  const { divisors, bound } = state;
  const period = product(divisors);
  const divisible = (value) => divisors.some(d => value % d === 0);
  const multiples = [...filter(range(1, period + 1), divisible)];
  const series = sum(multiples);
  const area = multiples.length * period;
  const exampleN = 4;
  const count = Math.floor((bound - 1) / period);

  const answer = period < bound ? (
    series * count + area * (count - 1) * count / 2 +
    sum(filter(range(period * count + 1, bound), divisible))
  ) : (
    sum(filter(range(bound), divisible))
  );

  const p = (...kids) => create('p', ...kids);  // create a paragraph
  const c = (line, ...lines) => createStyled(   // create a code-like block
    'pre', 'math',
    line, ...lines.flatMap(line => [create('br'), line]));

  function formatMultiples(index) {
    const n = multiples.length;
    const ms = multiples.map(x => x + index * period);
    const offset = index * period;
    return c(
      `${ms.join(' + ')}`,
      `= ${multiples.map(x => `(${x} + ${offset})`).join(' + ')}`,
      `= (${multiples.join(' + ')}) + (${n} * ${offset})`,
      `= ${series} + ${n * offset}`,
      `= ${sum(ms)}`);
  }

  return create(
    'div',
    createStyled('h3', 'problem__answer', `Answer: ${answer}`),

    p(`The quick and dirty way to calculate this sum is brute force.  For
       example, a Python loop:`),

    c(`>>> sum(i for i in range(${bound})`,
      `...     if any(i % d == 0 for d in (${divisors.join(', ')})))`,
      `${answer}`),

    p(`This loop entails O(L * B) divisibility checks, where L is the number of
       divisors (${divisors.length}) and B is the upper bound of our range
       (${bound}).  Alternatively, we can pursue an O(L * M) solution, where M
       is the product of the divisors (${divisors.join(' * ')} = ${period}).`),

    p(`Note that the sum of numbers divisible by ${formatList(divisors, 'or')}
       in the closed range 1 through ${period} is ${series}:`),

    c(`${multiples.join(' + ')} = ${series}`),

    // TODO: LCM instead of product
    p(`The number ${period} is special because it is the product of
       ${formatList(divisors, 'and')}, so divisibility checks are periodic with
       respect to sequences of that length.  Let's call ${period} the `,
      create('em', 'period'), `.`),

    p(`The sum of multiples in each subsequent sequence of ${period} numbers
       is similar to the first, except that each addend in the series is offset
       by the period times some whole number, such that the sum is increased by
       the period times the series length (i.e., times the number of
       multiples).  For example, consider the second ${period} natural numbers,
       ${period + 1} through ${2 * period}:`),

    formatMultiples(1),

    p(`And the third such sequence, ${2 * period + 1} through ${3 * period}:`),

    formatMultiples(2),

    p(`See how the sum is always ${series} plus some other number?  In fact,
       the sum of numbers divisible by ${formatList(divisors, 'or')} in the Ith
       sequence of ${period} numbers is always the first series (${series}),
       plus the number of multiples times the period times I, where I is the
       zero-based index of the sequence.  The number of multiples times the
       period is the constant ${multiples.length} * ${period} = ${area}, so the
       sum of N such series is ${series} * N + ${area} * (N - 1) * N / 2.  For
       example, consider N = ${exampleN}:`),

    create('table',
      create('tr',
        create('th', 'range'),
        create('th', 'formula'),
        create('th', 'sum')),
      ...[...range(exampleN)].map(i =>
        create('tr',
          create('td', `[${period * i + 1}, ${period * (i + 1)}]`),
          create('td', `${series} + ${area} * ${i}`),
          createStyled('td', 'table__number', `${series + area * i}`)))),

    p(`The value ${series} appears in each of the N rows, hence the term
       ${series} * N.  Likewise, if we distribute the constant ${area} over all
       the rows, then we have ${area} times the sum of 0 through N - 1, hence
       the term ${area} * (N - 1)  * N / 2.`),

    p(`We can determine the number N of ${period}-element subsequences to
       consider for a given upper bound B by dividing and rounding down:
       floor((${bound} - 1) / ${period}) = ${count}.  If there's any remainder,
       we can add the final series explicitly, as we did using the brute force
       Python loop above:`),

    c(`>>> ${series} * ${count} \\`,
      `... + ${area} * (${count} - 1) * ${count} // 2 \\`,
      `... + sum(i for i in range(${period} * ${count} + 1, ${bound})`,
      `...       if any(i % d == 0 for d in (${divisors.join(', ')})))`,
      `${answer}`),

    p(`Which algorithm runs faster?  The brute force "check all the divisors
       for all the numbers below the bound" approach requires each of B - 1
       numbers be checked against all L divisors, so it requires L * (B - 1)
       divisibility checks, plus B - 1 additions (as we keep a running tally),
       as well as loop overhead proportional to B - 1.  If integer math
       operations all have similar time cost, then time complexity is
       O(L * B).`),

    p(`The second approach requires us to multiply the L divisors, and do a
       constant number of arithmetic operations, but the division-check loop is
       limited to M - 1 rather than B - 1 iterations.  Its time complexity is
       thus O(L * M).`),

    p(`Both algorithms operate in O(1) space, so the latter, "clever" algorithm
       is probably worth its weight only when M < B.  In the case at hand,
       ${period} is ${
          period < bound
           ? `indeed less than ${bound}, so the clever algorithm`
           : `not less than ${bound}, so the simple loop`
       } wins.`));
}

function makeInputBox() {
  const divisorsInput = create('input');
  divisorsInput.id = 'divisors-input';
  divisorsInput.type = 'text';
  divisorsInput.value = state.divisors.join(', ');

  divisorsInput.addEventListener('input', (event) => {
    event.preventDefault();
    const value = event.target.value;
    const words = value.replace(/[, ]+/g, ' ').trim().split(' ');
    if (words.every(w => /^[1-9]\d*$/.test(w) && w.length < 16)) {
      state.divisors = words.map(w => Number(w));
      container.lastChild.replaceWith(render());
    } else {
      event.target.value = state.divisors.join(', ');
    }
  });

  const divisorsLabel = create('label', 'Divisors:');
  divisorsLabel.htmlFor = divisorsInput.id;

  const boundInput = create('input');
  boundInput.id = 'bound-input';
  boundInput.type = 'text';
  boundInput.value = state.bound;

  boundInput.addEventListener('input', (event) => {
    event.preventDefault();
    const value = event.target.value;
    if (/^\d+$/.test(value) && value.length < 16) {
      state.bound = Number(value);
      container.lastChild.replaceWith(render());
    } else {
      event.target.value = state.bound;
    }
  });

  const boundLabel = create('label', 'Below:');
  boundLabel.htmlFor = boundInput.id;

  const box = createStyled(
    'div',
    'input-box',
    divisorsLabel, divisorsInput,
    boundLabel, boundInput);

  return box;
}

container.append(makeInputBox(), render());

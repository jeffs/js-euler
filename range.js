export function* range(stop) {
  for (let i = 0; i < stop; ++i) yield i;
}

export function* filter(iterable, predicate) {
  for (const value of iterable) {
    if (predicate(value)) yield value;
  }
}

export function reduce(iterable, reducer, accumulator) {
  for (const value of iterable) {
    accumulator = reducer(accumulator, value);
  }
  return accumulator;
}

export function sum(iterable) {
  return reduce(iterable, (a, x) => a + x, 0);
}

export function product(iterable) {
  return reduce(iterable, (a, x) => a * x, 1);
}

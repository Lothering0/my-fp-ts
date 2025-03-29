type Curry = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C
export const curry: Curry =
  <A, B, C>(f: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B) =>
    f (a, b)

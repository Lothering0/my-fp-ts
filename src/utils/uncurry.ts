type Uncurry = <A, B, C>(f: (a: A) => (b: B) => C) => (a: A, b: B) => C
export const uncurry: Uncurry =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (a: A, b: B) =>
    f (a) (b)

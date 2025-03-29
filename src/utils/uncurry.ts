type Uncurry = <A, B, C>(a: A, b: B) => (f: (a: A) => (b: B) => C) => C
export const uncurry: Uncurry =
  <A, B, C>(a: A, b: B) =>
  (f: (a: A) => (b: B) => C) =>
    f (a) (b)

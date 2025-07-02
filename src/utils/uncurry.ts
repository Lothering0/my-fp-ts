export const uncurry: {
  <A, B, C>(f: (a: A) => (b: B) => C): (a: A, b: B) => C
} =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (a: A, b: B) =>
    f (a) (b)

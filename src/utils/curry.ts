export const curry: {
  <A, B, C>(abc: (a: A, b: B) => C): (a: A) => (b: B) => C
} =
  <A, B, C>(abc: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B) =>
    abc (a, b)

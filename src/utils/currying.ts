export const curry: {
  <A, B, C>(abc: (a: A, b: B) => C): (a: A) => (b: B) => C
} =
  <A, B, C>(abc: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B) =>
    abc (a, b)

export const uncurry: {
  <A, B, C>(f: (a: A) => (b: B) => C): (a: A, b: B) => C
} =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (a: A, b: B) =>
    f (a) (b)

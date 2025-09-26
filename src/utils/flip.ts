export const flip: {
  <A, B, C>(abc: (a: A) => (b: B) => C): (b: B) => (a: A) => C
} = abc => b => a => abc(a)(b)

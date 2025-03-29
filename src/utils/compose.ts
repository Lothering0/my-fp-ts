type Compose = <A, B = A, C = B>(
  bc: (b: B) => C,
  ab: (a: A) => B,
) => (a: A) => C
export const compose: Compose = (f, g) => a => f (g (a))

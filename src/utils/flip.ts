type Flip = <A, B, C>(abc: (a: A) => (b: B) => C) => (b: B) => (a: A) => C
export const flip: Flip = abc => b => a => abc (a) (b)

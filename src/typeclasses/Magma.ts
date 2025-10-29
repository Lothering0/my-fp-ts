export interface Magma<S> {
  readonly combine: (y: S) => (x: S) => S
}

export const reverse: {
  <S>(Magma: Magma<S>): Magma<S>
} = Magma => ({
  combine: y => x => Magma.combine(x)(y),
})

export const constant: {
  <S>(a: S): Magma<S>
} = a => ({
  combine: () => () => a,
})

export const combineAll: {
  <S>(Magma: Magma<S>): (start: S) => (as: Iterable<S>) => S
} = Magma => start => as =>
  [...as].reduce((out, a) => Magma.combine(a)(out), start)

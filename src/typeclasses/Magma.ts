export interface Magma<Fixed> {
  readonly combine: (y: Fixed) => (x: Fixed) => Fixed
}

export const reverse: {
  <Fixed>(Magma: Magma<Fixed>): Magma<Fixed>
} = Magma => ({
  combine: y => x => Magma.combine (x) (y),
})

export const constant: {
  <Fixed>(a: Fixed): Magma<Fixed>
} = a => ({
  combine: () => () => a,
})

export const combineAll: {
  <Fixed>(
    Magma: Magma<Fixed>,
  ): (start: Fixed) => (as: ReadonlyArray<Fixed>) => Fixed
} = Magma => start => as => as.reduce ((out, a) => Magma.combine (a) (out), start)

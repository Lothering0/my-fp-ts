export interface Magma<Fixed> {
  readonly combine: (y: Fixed) => (x: Fixed) => Fixed
}

export const reverse: {
  <Fixed>(Magma: Magma<Fixed>): Magma<Fixed>
} = Magma => ({
  combine: y => x => Magma.combine (x) (y),
})

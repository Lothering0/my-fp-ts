export interface Semigroup<In> {
  /** Associative operation */
  readonly combine: (y: In) => (x: In) => In
}

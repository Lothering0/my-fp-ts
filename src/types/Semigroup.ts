export interface Semigroup<A> {
  /** Associative operation */
  readonly combine: (y: A) => (x: A) => A
}

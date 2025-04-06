export interface Semigroup<A> {
  /** Associative operation */
  readonly concat: (x: A, y: A) => A
}

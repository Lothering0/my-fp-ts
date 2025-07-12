export interface Semigroup<A> {
  /** Associative operation */
  readonly concat: {
    (y: A): (x: A) => A
    (x: A, y: A): A
  }
}

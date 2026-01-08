export interface Refinement<A, B extends A> {
  (a: A): a is B
}

export interface RefinementWithIndex<A, B extends A, Index> {
  (a: A, i: Index): a is B
}

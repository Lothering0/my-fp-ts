export interface Refinement<In, Out extends In> {
  (a: In): a is Out
}

export interface RefinementWithIndex<In, Out extends In, Index> {
  (a: In, i: Index): a is Out
}

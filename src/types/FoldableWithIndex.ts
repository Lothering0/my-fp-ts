import { Foldable } from "./Foldable"
import { HKT, Kind } from "./HKT"

export interface FoldableWithIndex<F extends HKT, I> extends Foldable<F> {
  readonly reduceWithIndex: <A, B>(
    b: B,
    ibab: (i: I, b: B, a: A) => B,
  ) => <R, E>(self: Kind<F, R, E, A>) => B

  readonly reduceRightWithIndex: <A, B>(
    b: B,
    iabb: (i: I, a: A, b: B) => B,
  ) => <R, E>(self: Kind<F, R, E, A>) => B
}

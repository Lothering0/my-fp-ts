import { Foldable } from "./Foldable"
import { HKT, Kind } from "./HKT"

export interface FoldableWithIndex<F extends HKT, I> extends Foldable<F> {
  readonly reduceWithIndex: {
    <E, A, B>(b: B, ibab: (i: I, b: B, a: A) => B): (self: Kind<F, E, A>) => B
    <E, A, B>(self: Kind<F, E, A>, b: B, ibab: (i: I, b: B, a: A) => B): B
  }
  readonly reduceRightWithIndex: {
    <E, A, B>(b: B, iabb: (i: I, a: A, b: B) => B): (self: Kind<F, E, A>) => B
    <E, A, B>(self: Kind<F, E, A>, b: B, iabb: (i: I, a: A, b: B) => B): B
  }
}

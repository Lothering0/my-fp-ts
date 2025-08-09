import { Foldable } from "./Foldable"
import { Hkt, Kind } from "./Hkt"

export interface FoldableWithIndex<F extends Hkt, I> extends Foldable<F> {
  readonly reduceWithIndex: <A, B>(
    b: B,
    ibab: (i: I, b: B, a: A) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => B

  readonly reduceRightWithIndex: <A, B>(
    b: B,
    iabb: (i: I, a: A, b: B) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => B
}

import { Foldable } from "./Foldable"
import { Hkt, Kind } from "./Hkt"

export interface FoldableWithIndex<F extends Hkt, I> extends Foldable<F> {
  readonly reduceWithIndex: <A, B>(
    b: B,
    baib: (b: B, a: A, i: I) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => B

  readonly reduceRightWithIndex: <A, B>(
    b: B,
    abib: (a: A, b: B, i: I) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => B
}

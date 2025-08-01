import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface FunctorWithIndex<F extends HKT, I> extends Functor<F> {
  readonly mapWithIndex: <A, B>(
    iab: (i: I, a: A) => B,
  ) => <S, _>(self: Kind<F, S, _, A>) => Kind<F, S, _, B>
}

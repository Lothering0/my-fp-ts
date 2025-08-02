import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface FunctorWithIndex<F extends HKT, I> extends Functor<F> {
  readonly mapWithIndex: <A, B>(
    iab: (i: I, a: A) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, B>
}

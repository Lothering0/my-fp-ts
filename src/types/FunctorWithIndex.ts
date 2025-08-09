import { Functor } from "./Functor"
import { Hkt, Kind } from "./Hkt"

export interface FunctorWithIndex<F extends Hkt, I> extends Functor<F> {
  readonly mapWithIndex: <A, B>(
    iab: (i: I, a: A) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, B>
}

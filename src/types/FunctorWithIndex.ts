import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface FunctorWithIndex<F extends HKT, I> extends Functor<F> {
  readonly mapWithIndex: <A, B>(
    iab: (i: I, a: A) => B,
  ) => <_, _2>(self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
}

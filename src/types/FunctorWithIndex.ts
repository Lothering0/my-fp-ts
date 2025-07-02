import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface FunctorWithIndex<F extends HKT, I> extends Functor<F> {
  readonly mapWithIndex: {
    <_, _2, A, B>(
      iab: (i: I, a: A) => B,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      iab: (i: I, a: A) => B,
    ): Kind<F, _, _2, B>
  }
}

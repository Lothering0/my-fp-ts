import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface FunctorWithIndex<F extends HKT, I> extends Functor<F> {
  readonly mapWithIndex: {
    <E, A, B>(iab: (i: I, a: A) => B): (self: Kind<F, E, A>) => Kind<F, E, B>
    <E, A, B>(self: Kind<F, E, A>, iab: (i: I, a: A) => B): Kind<F, E, B>
  }
}

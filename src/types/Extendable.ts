import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface Extendable<F extends HKT> extends Functor<F> {
  readonly extend: {
    <_, _2, A, B>(
      fab: (fa: Kind<F, _, _2, A>) => B,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      fab: (fa: Kind<F, _, _2, A>) => B,
    ): Kind<F, _, _2, B>
  }
}

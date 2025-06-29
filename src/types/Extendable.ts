import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface Extendable<F extends HKT> extends Functor<F> {
  readonly extend: {
    <_, A, B>(
      fab: (fa: Kind<F, _, A>) => B,
    ): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, A>, fab: (fa: Kind<F, _, A>) => B): Kind<F, _, B>
  }
}

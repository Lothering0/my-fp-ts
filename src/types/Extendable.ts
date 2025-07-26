import { identity } from "../modules/Identity"
import { Functor } from "./Functor"
import { HKT, Kind } from "./HKT"

export interface Extendable<F extends HKT> extends Functor<F> {
  readonly extend: <_, _2, A, B>(
    fab: (fa: Kind<F, _, _2, A>) => B,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
  readonly duplicate: <_, _2, A>(
    self: Kind<F, _, _2, A>,
  ) => Kind<F, _, _2, Kind<F, _, _2, A>>
}

export const createExtendable: {
  <F extends HKT>(
    Extendable: Functor<F> & Pick<Extendable<F>, "extend">,
  ): Extendable<F>
} = Extendable => ({
  ...Extendable,
  duplicate: Extendable.extend (identity),
})

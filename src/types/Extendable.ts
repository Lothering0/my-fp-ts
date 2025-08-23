import { identity } from "../modules/Identity"
import { Functor } from "./Functor"
import { Hkt, Kind } from "./Hkt"

export interface Extendable<F extends Hkt> extends Functor<F> {
  readonly extend: <In, Out, Collectable, Fixed>(
    fab: (fa: Kind<F, In, Collectable, Fixed>) => Out,
  ) => (
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
  readonly duplicate: <In, Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Kind<F, In, Collectable, Fixed>, Collectable, Fixed>
}

export const createExtendable: {
  <F extends Hkt>(
    Extendable: Functor<F> & Pick<Extendable<F>, "extend">,
  ): Extendable<F>
} = Extendable => ({
  ...Extendable,
  duplicate: Extendable.extend (identity),
})

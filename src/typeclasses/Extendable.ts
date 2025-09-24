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

export const create: {
  <F extends Hkt>(
    Functor: Functor<F>,
    Extendable: Pick<Extendable<F>, "extend">,
  ): Extendable<F>
} = (Functor, Extendable) => ({
  ...Functor,
  ...Extendable,
  duplicate: Extendable.extend (identity),
})

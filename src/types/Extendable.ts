import { identity } from "../modules/Identity"
import { Functor } from "./Functor"
import { Hkt, Kind } from "./Hkt"

export interface Extendable<F extends Hkt> extends Functor<F> {
  readonly extend: <S, E, A, B>(
    fab: (fa: Kind<F, S, E, A>) => B,
  ) => (self: Kind<F, S, E, A>) => Kind<F, S, E, B>
  readonly duplicate: <S, E, A>(
    self: Kind<F, S, E, A>,
  ) => Kind<F, S, E, Kind<F, S, E, A>>
}

export const createExtendable: {
  <F extends Hkt>(
    Extendable: Functor<F> & Pick<Extendable<F>, "extend">,
  ): Extendable<F>
} = Extendable => ({
  ...Extendable,
  duplicate: Extendable.extend (identity),
})

import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { flow } from "../utils/flow"

export interface Bifunctor<F extends HKT> extends Functor<F> {
  readonly mapLeft: <E, D>(
    ed: (e: E) => D,
  ) => <_, _2>(self: Kind<F, _, E, _2>) => Kind<F, _, D, _2>

  readonly bimap: <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ) => <_>(self: Kind<F, _, E, A>) => Kind<F, _, D, B>
}

export const createBifunctor = <F extends HKT>(
  Bifunctor: Functor<F> & Pick<Bifunctor<F>, "mapLeft">,
): Bifunctor<F> => {
  const { map, mapLeft } = Bifunctor

  return {
    ...Bifunctor,
    bimap: (ed, ab) => flow (map (ab), mapLeft (ed)),
  }
}

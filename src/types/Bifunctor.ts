import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { flow } from "../utils/flow"

export interface Bifunctor<F extends HKT> extends Functor<F> {
  readonly mapLeft: <E, D>(
    ed: (e: E) => D,
  ) => <S, _>(self: Kind<F, S, E, _>) => Kind<F, S, D, _>

  readonly bimap: <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ) => <S>(self: Kind<F, S, E, A>) => Kind<F, S, D, B>
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

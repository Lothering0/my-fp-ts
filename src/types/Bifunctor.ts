import { Hkt, Kind } from "./Hkt"
import { Functor } from "./Functor"
import { flow } from "../utils/flow"

export interface Bifunctor<F extends Hkt> extends Functor<F> {
  readonly mapLeft: <E, D>(
    ed: (e: E) => D,
  ) => <S, A>(self: Kind<F, S, E, A>) => Kind<F, S, D, A>

  readonly bimap: <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ) => <S>(self: Kind<F, S, E, A>) => Kind<F, S, D, B>
}

export const createBifunctor = <F extends Hkt>(
  Bifunctor: Functor<F> & Pick<Bifunctor<F>, "mapLeft">,
): Bifunctor<F> => {
  const { map, mapLeft } = Bifunctor

  return {
    ...Bifunctor,
    bimap: (ed, ab) => flow (map (ab), mapLeft (ed)),
  }
}

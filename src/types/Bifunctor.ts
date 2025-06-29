import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { overload } from "src/utils/overloads"

export interface Bifunctor<F extends HKT> extends Functor<F> {
  readonly mapLeft: {
    <E, _, D>(ed: (e: E) => D): (self: Kind<F, E, _>) => Kind<F, D, _>
    <E, _, D>(self: Kind<F, E, _>, ed: (e: E) => D): Kind<F, D, _>
  }

  readonly bimap: {
    <E, A, D, B>(
      ed: (e: E) => D,
      ab: (a: A) => B,
    ): (self: Kind<F, E, A>) => Kind<F, D, B>
    <E, A, D, B>(
      self: Kind<F, E, A>,
      ed: (e: E) => D,
      ab: (a: A) => B,
    ): Kind<F, D, B>
  }
}

export const createBifunctor = <F extends HKT>(
  bifunctor: Functor<F> & Pick<Bifunctor<F>, "mapLeft">,
): Bifunctor<F> => {
  const { map, mapLeft } = bifunctor

  return {
    ...bifunctor,
    bimap: overload (
      2,
      <E, A, D, B>(
        self: Kind<F, E, A>,
        ed: (e: E) => D,
        ab: (a: A) => B,
      ): Kind<F, D, B> => mapLeft (map (self, ab), ed),
    ),
  }
}

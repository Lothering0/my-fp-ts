import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { overload } from "../utils/overloads"

export interface Bifunctor<F extends HKT> extends Functor<F> {
  readonly mapLeft: {
    <_, E, _2, D>(
      ed: (e: E) => D,
    ): (self: Kind<F, _, E, _2>) => Kind<F, _, D, _2>
    <_, E, _2, D>(self: Kind<F, _, E, _2>, ed: (e: E) => D): Kind<F, _, D, _2>
  }

  readonly bimap: {
    <_, E, A, D, B>(
      ed: (e: E) => D,
      ab: (a: A) => B,
    ): (self: Kind<F, _, E, A>) => Kind<F, _, D, B>
    <_, E, A, D, B>(
      self: Kind<F, _, E, A>,
      ed: (e: E) => D,
      ab: (a: A) => B,
    ): Kind<F, _, D, B>
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
      <_, E, A, D, B>(
        self: Kind<F, _, E, A>,
        ed: (e: E) => D,
        ab: (a: A) => B,
      ): Kind<F, _, D, B> => mapLeft (map (self, ab), ed),
    ),
  }
}

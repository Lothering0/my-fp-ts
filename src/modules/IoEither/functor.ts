import * as E from "../Either"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { IoEitherHKT, IoEither, fromIoEither } from "./io-either"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<IoEitherHKT> = {
  map: overload (
    1,
    <_, A, B>(self: IoEither<_, A>, ab: (a: A) => B): IoEither<_, B> =>
      () =>
        pipe (self, fromIoEither, E.map (ab)),
  ),
}

export const bifunctor: Bifunctor<IoEitherHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: IoEither<E, _>, ed: (e: E) => D): IoEither<D, _> =>
      () =>
        pipe (self, fromIoEither, E.mapLeft (ed)),
  ),
})

export const { map, mapLeft, bimap } = bifunctor

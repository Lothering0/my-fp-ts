import * as E from "../either"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { _URI, IOEither, fromIoEither } from "./io-either"
import { pipe } from "../../utils/flow"

export const functor: Functor2<typeof _URI> = createFunctor2 ({
  _URI,
  map:
    <_, A, B>(fma: IOEither<_, A>, f: (a: A) => B): IOEither<_, B> =>
    () =>
      pipe (fma, fromIoEither, E.map (f)),
})

export const bifunctor: Bifunctor<typeof _URI> = createBifunctor ({
  ...functor,
  mapLeft:
    <E, _, D>(fma: IOEither<E, _>, f: (e: E) => D): IOEither<D, _> =>
    () =>
      pipe (fma, fromIoEither, E.mapLeft (f)),
})

export const { map, mapLeft, bimap } = bifunctor

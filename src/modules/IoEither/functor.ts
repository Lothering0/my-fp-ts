import * as E from "../Either"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { URI, IoEither, fromIoEither } from "./io-either"
import { pipe } from "../../utils/flow"

export const functor: Functor2<URI> = createFunctor2 ({
  URI,
  map:
    <_, A, B>(fma: IoEither<_, A>, f: (a: A) => B): IoEither<_, B> =>
    () =>
      pipe (fma, fromIoEither, E.map (f)),
})

export const bifunctor: Bifunctor<URI> = createBifunctor ({
  ...functor,
  mapLeft:
    <E, _, D>(fma: IoEither<E, _>, f: (e: E) => D): IoEither<D, _> =>
    () =>
      pipe (fma, fromIoEither, E.mapLeft (f)),
})

export const { map, mapLeft, bimap } = bifunctor

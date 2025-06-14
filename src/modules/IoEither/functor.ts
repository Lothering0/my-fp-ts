import * as E from "../Either"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { _URI, IoEither, fromIoEither } from "./io-either"
import { pipe } from "../../utils/flow"

export const functor: Functor2<typeof _URI> = createFunctor2 ({
  _URI,
  map:
    <_, A, B>(fma: IoEither<_, A>, f: (a: A) => B): IoEither<_, B> =>
    () =>
      pipe (fma, fromIoEither, E.map (f)),
})

export const bifunctor: Bifunctor<typeof _URI> = createBifunctor ({
  ...functor,
  mapLeft:
    <E, _, D>(fma: IoEither<E, _>, f: (e: E) => D): IoEither<D, _> =>
    () =>
      pipe (fma, fromIoEither, E.mapLeft (f)),
})

export const { map, mapLeft, bimap } = bifunctor

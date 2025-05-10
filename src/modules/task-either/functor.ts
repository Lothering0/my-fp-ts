import * as E from "../either"
import { createFunctor2, Functor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { fromTaskEither, TaskEither } from "./task-either"

export const functor: Functor2<"TaskEither"> = createFunctor2 ({
  _URI: "TaskEither",
  map:
    <_, A, B>(fma: TaskEither<_, A>, f: (a: A) => B): TaskEither<_, B> =>
    () =>
      fromTaskEither (fma).then (ma => E.map (ma, f)),
})

export const bifunctor: Bifunctor<"TaskEither"> = createBifunctor ({
  ...functor,
  mapLeft:
    <E, _, D>(fma: TaskEither<E, _>, f: (e: E) => D): TaskEither<D, _> =>
    () =>
      fromTaskEither (fma).then (ma => E.mapLeft (ma, f)),
})

export const { map, mapLeft, bimap } = bifunctor

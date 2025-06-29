import * as E from "../Either"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { TaskEitherHKT, fromTaskEither, TaskEither } from "./task-either"
import { overload } from "../../utils/overloads"

export const functor: Functor<TaskEitherHKT> = {
  map: overload (
    1,
    <_, A, B>(self: TaskEither<_, A>, ab: (a: A) => B): TaskEither<_, B> =>
      () =>
        fromTaskEither (self).then (E.map (ab)),
  ),
}

export const bifunctor: Bifunctor<TaskEitherHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: TaskEither<E, _>, ed: (e: E) => D): TaskEither<D, _> =>
      () =>
        fromTaskEither (self).then (E.mapLeft (ed)),
  ),
})

export const { map, mapLeft, bimap } = bifunctor

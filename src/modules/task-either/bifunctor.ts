import * as E from "../either"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { TaskEither, fromTaskEither } from "./task-either"

export const bifunctor: Bifunctor<"TaskEither"> = createBifunctor ({
  _URI: "TaskEither",
  mapLeft:
    <E, _, B>(fma: TaskEither<E, _>, f: (e: E) => B): TaskEither<B, _> =>
    () =>
      fromTaskEither (fma).then (ma => E.mapLeft (ma, f)),
  bimap:
    <E, A, B = E, C = A>(
      fma: TaskEither<E, A>,
      f: (e: E) => B,
      g: (a: A) => C,
    ): TaskEither<B, C> =>
    () =>
      fromTaskEither (fma).then (ma =>
        E.isLeft (ma) ? E.mapLeft<E, C, B> (ma, f) : E.map<B, A, C> (ma, g),
      ),
})

export const { mapLeft, bimap } = bifunctor

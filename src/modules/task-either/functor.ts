import * as E from "../either"
import { createFunctor2, Functor2 } from "../../types/Functor"
import { fromTaskEither, TaskEither, right } from "./task-either"

export const functor: Functor2<"TaskEither"> = createFunctor2 ({
  _URI: "TaskEither",
  of: right,
  map:
    <_, A, B>(fma: TaskEither<_, A>, f: (a: A) => B): TaskEither<_, B> =>
    () =>
      fromTaskEither (fma).then (ma => E.map (ma, f)),
})

export const { of, map } = functor

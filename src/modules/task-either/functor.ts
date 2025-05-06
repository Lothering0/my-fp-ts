import * as E from "../either"
import { createFunctor2, Functor2 } from "../../types/Functor"
import { fromTaskEither, TaskEither, taskRight } from "./task-either"

export const functor: Functor2<"TaskEither"> = createFunctor2 ({
  _URI: "TaskEither",
  of: taskRight,
  map:
    <_, A, B>(fma: TaskEither<_, A>, f: (a: A) => B): TaskEither<_, B> =>
    () =>
      fromTaskEither (fma).then (ma => E.map (ma, f)),
})

export const { of, map } = functor

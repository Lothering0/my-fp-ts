import * as E from "../either"
import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { fromTaskEither, TaskEither } from "./task-either"
import { pipe } from "../../utils/pipe"

export const applicative: Applicative2<"TaskEither"> = createApplicative2 ({
  _URI: "TaskEither",
  apply:
    <_, A, B>(
      fma: TaskEither<_, A>,
      fmf: TaskEither<_, (a: A) => B>,
    ): TaskEither<_, B> =>
    () =>
      fromTaskEither (fma).then (ma =>
        fromTaskEither (fmf).then (mf =>
          pipe (
            E.Do,
            E.apS ("a", ma),
            E.apS ("f", mf),
            E.map (({ f, a }) => f (a)),
          ),
        ),
      ),
})

export const { apply } = applicative

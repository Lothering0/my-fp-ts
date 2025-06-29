import * as E from "../Either"
import { Applicative, createApplicative } from "../../types/Applicative"
import { TaskEitherHKT, right, fromTaskEither, TaskEither } from "./task-either"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<TaskEitherHKT> = createApplicative ({
  ...functor,
  of: right,
  ap: overload (
    1,
    <_, A, B>(
      self: TaskEither<_, (a: A) => B>,
      fma: TaskEither<_, A>,
    ): TaskEither<_, B> =>
      () =>
        Promise.all ([fromTaskEither (self), fromTaskEither (fma)]).then (
          ([mab, ma]) =>
            pipe (
              E.Do,
              E.apS ("a", ma),
              E.apS ("ab", mab),
              E.map (({ ab, a }) => ab (a)),
            ),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

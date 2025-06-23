import * as E from "../Either"
import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { URI, right, fromTaskEither, TaskEither } from "./task-either"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative2<URI> = createApplicative2 ({
  ...functor,
  of: right,
  ap:
    <_, A, B>(
      fmf: TaskEither<_, (a: A) => B>,
      fma: TaskEither<_, A>,
    ): TaskEither<_, B> =>
    () =>
      Promise.all ([fromTaskEither (fmf), fromTaskEither (fma)]).then (([mf, ma]) =>
        pipe (
          E.Do,
          E.apS ("a", ma),
          E.apS ("f", mf),
          E.map (({ f, a }) => f (a)),
        ),
      ),
})

export const { of, ap, apply, flap, flipApply } = applicative

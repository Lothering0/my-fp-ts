import * as O from "../option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { some, fromTaskOption, TaskOption } from "./task-option"
import { pipe } from "../../utils/pipe"

export const applicative: Applicative<"TaskOption"> = createApplicative ({
  _URI: "TaskOption",
  of: some,
  apply:
    <A, B>(fma: TaskOption<A>, fmf: TaskOption<(a: A) => B>): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (ma =>
        fromTaskOption (fmf).then (mf =>
          pipe (
            O.Do,
            O.apS ("a", ma),
            O.apS ("f", mf),
            O.map (({ f, a }) => f (a)),
          ),
        ),
      ),
})

export const { of, apply } = applicative

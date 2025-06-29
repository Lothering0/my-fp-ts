import * as O from "../Option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { TaskOptionHKT, some, fromTaskOption, TaskOption } from "./task-option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<TaskOptionHKT> = createApplicative ({
  ...functor,
  of: some,
  ap: overload (
    1,
    <A, B>(self: TaskOption<(a: A) => B>, fma: TaskOption<A>): TaskOption<B> =>
      () =>
        Promise.all ([fromTaskOption (self), fromTaskOption (fma)]).then (
          ([mab, ma]) =>
            pipe (
              O.Do,
              O.apS ("a", ma),
              O.apS ("ab", mab),
              O.map (({ ab, a }) => ab (a)),
            ),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

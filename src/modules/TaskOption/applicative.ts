import * as O from "../Option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { URI, some, fromTaskOption, TaskOption } from "./task-option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: some,
  ap:
    <A, B>(fmf: TaskOption<(a: A) => B>, fma: TaskOption<A>): TaskOption<B> =>
    () =>
      Promise.all ([fromTaskOption (fmf), fromTaskOption (fma)]).then (([mf, ma]) =>
        pipe (
          O.Do,
          O.apS ("a", ma),
          O.apS ("f", mf),
          O.map (({ f, a }) => f (a)),
        ),
      ),
})

export const { of, ap, apply, flap, flipApply } = applicative

import { Applicative, createApplicative } from "../../types/Applicative"
import { functor } from "./functor"
import { URI, task, fromTask, Task } from "./task"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: task,
  ap:
    <A, B>(ff: Task<(a: A) => B>, fa: Task<A>): Task<B> =>
    () =>
      Promise.all ([fromTask (ff), fromTask (fa)]).then (([f, a]) => f (a)),
})

export const { of, ap, apply, flap, flipApply } = applicative

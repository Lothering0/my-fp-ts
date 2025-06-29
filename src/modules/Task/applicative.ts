import { Applicative, createApplicative } from "../../types/Applicative"
import { functor } from "./functor"
import { TaskHKT, task, fromTask, Task } from "./task"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<TaskHKT> = createApplicative ({
  ...functor,
  of: task,
  ap: overload (
    1,
    <A, B>(self: Task<(a: A) => B>, fa: Task<A>): Task<B> =>
      () =>
        Promise.all ([fromTask (self), fromTask (fa)]).then (([f, a]) => f (a)),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

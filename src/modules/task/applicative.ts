import { Applicative, createApplicative } from "../../types/Applicative"
import { _URI, task, fromTask, Task } from "./task"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  _URI,
  of: task,
  apply:
    <A, B>(fa: Task<A>, ff: Task<(a: A) => B>): Task<B> =>
    () =>
      fromTask (fa).then (a => fromTask (ff).then (f => f (a))),
})

export const { of, apply } = applicative

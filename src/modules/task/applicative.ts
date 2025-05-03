import { Applicative, createApplicative } from "../../types/Applicative"
import { fromTask, Task } from "./task"

export const applicative: Applicative<"Task"> = createApplicative ({
  _URI: "Task",
  apply:
    <A, B>(fa: Task<A>, ff: Task<(a: A) => B>): Task<B> =>
    () =>
      fromTask (fa).then (a => fromTask (ff).then (f => f (a))),
})

export const { apply } = applicative

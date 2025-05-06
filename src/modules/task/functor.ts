import { createFunctor, Functor } from "../../types/Functor"
import { Task, task, fromTask } from "./task"

export const functor: Functor<"Task"> = createFunctor ({
  _URI: "Task",
  of: task,
  map:
    <A, B>(fa: Task<A>, f: (a: A) => B): Task<B> =>
    () =>
      fromTask (fa).then (f),
})

export const { of, map } = functor

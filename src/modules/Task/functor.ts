import { Functor } from "../../types/Functor"
import { TaskHKT, Task, fromTask } from "./task"
import { overload } from "../../utils/overloads"

export const functor: Functor<TaskHKT> = {
  map: overload (
    1,
    <A, B>(self: Task<A>, ab: (a: A) => B): Task<B> =>
      () =>
        fromTask (self).then (ab),
  ),
}

export const { map } = functor

import * as O from "../Option"
import { Functor } from "../../types/Functor"
import { TaskOptionHKT, TaskOption, fromTaskOption } from "./task-option"
import { overload } from "src/utils/overloads"

export const functor: Functor<TaskOptionHKT> = {
  map: overload (
    1,
    <A, B>(self: TaskOption<A>, ab: (a: A) => B): TaskOption<B> =>
      () =>
        fromTaskOption (self).then (O.map (ab)),
  ),
}

export const { map } = functor

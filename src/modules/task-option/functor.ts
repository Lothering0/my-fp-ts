import * as O from "../option"
import { createFunctor, Functor } from "../../types/Functor"
import { TaskOption, fromTaskOption } from "./task-option"

export const functor: Functor<"TaskOption"> = createFunctor ({
  _URI: "TaskOption",
  map:
    <A, B>(fma: TaskOption<A>, f: (a: A) => B): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (O.map (f)),
})

export const { map } = functor

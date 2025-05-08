import * as O from "../option"
import { createFunctor, Functor } from "../../types/Functor"
import { TaskOption, some, fromTaskOption } from "./task-option"

export const functor: Functor<"TaskOption"> = createFunctor ({
  _URI: "TaskOption",
  of: some,
  map:
    <A, B>(fma: TaskOption<A>, f: (a: A) => B): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (ma => O.map (ma, f)),
})

export const { map, of } = functor

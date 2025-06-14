import * as O from "../Option"
import { createFunctor, Functor } from "../../types/Functor"
import { _URI, TaskOption, fromTaskOption } from "./task-option"

export const functor: Functor<typeof _URI> = createFunctor ({
  _URI,
  map:
    <A, B>(fma: TaskOption<A>, f: (a: A) => B): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (O.map (f)),
})

export const { map } = functor

import * as O from "../Option"
import { createFunctor, Functor } from "../../types/Functor"
import { URI, TaskOption, fromTaskOption } from "./task-option"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map:
    <A, B>(fma: TaskOption<A>, f: (a: A) => B): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (O.map (f)),
})

export const { map } = functor

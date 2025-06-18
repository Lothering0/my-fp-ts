import { createFunctor, Functor } from "../../types/Functor"
import { URI, Task, fromTask } from "./task"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map:
    <A, B>(fa: Task<A>, f: (a: A) => B): Task<B> =>
    () =>
      fromTask (fa).then (f),
})

export const { map } = functor

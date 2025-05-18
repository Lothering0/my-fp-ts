import { createFunctor, Functor } from "../../types/Functor"
import { _URI, IO, fromIo } from "./io"
import { pipe } from "../../utils/flow"

export const functor: Functor<typeof _URI> = createFunctor ({
  _URI,
  map:
    <A, B>(fa: IO<A>, f: (a: A) => B) =>
    () =>
      pipe (fa, fromIo, f),
})

export const { map } = functor

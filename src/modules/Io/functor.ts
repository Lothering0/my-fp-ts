import { createFunctor, Functor } from "../../types/Functor"
import { _URI, Io, fromIo } from "./io"
import { pipe } from "../../utils/flow"

export const functor: Functor<typeof _URI> = createFunctor ({
  _URI,
  map:
    <A, B>(fa: Io<A>, f: (a: A) => B) =>
    () =>
      pipe (fa, fromIo, f),
})

export const { map } = functor

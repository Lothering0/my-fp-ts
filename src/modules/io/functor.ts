import { createFunctor, Functor } from "../../types/Functor"
import { IO, io, fromIo } from "./io"
import { pipe } from "../../utils/pipe"

export const functor: Functor<"IO"> = createFunctor ({
  _URI: "IO",
  of: io,
  map:
    <A, B>(fa: IO<A>, f: (a: A) => B) =>
    () =>
      pipe (fa, fromIo, f),
})

export const { of, map } = functor

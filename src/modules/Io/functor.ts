import { Functor } from "../../types/Functor"
import { IoHKT, Io, fromIo } from "./io"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<IoHKT> = {
  map: overload (
    1,
    <A, B>(self: Io<A>, ab: (a: A) => B): Io<B> =>
      () =>
        pipe (self, fromIo, ab),
  ),
}

export const { map } = functor

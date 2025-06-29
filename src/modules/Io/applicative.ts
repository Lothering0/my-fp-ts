import { functor, map } from "./functor"
import { IoHKT, io, fromIo, Io } from "./io"
import { Applicative, createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<IoHKT> = createApplicative ({
  ...functor,
  of: io,
  ap: overload (
    1,
    <A, B>(self: Io<(a: A) => B>, fa: Io<A>): Io<B> =>
      pipe (fa, map (fromIo (self))),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

import * as E from "../Either"
import { Applicative, createApplicative } from "../../types/Applicative"
import { right, fromIoEither, IoEither, IoEitherHKT } from "./io-either"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "src/utils/overloads"

export const applicative: Applicative<IoEitherHKT> = createApplicative ({
  ...functor,
  of: right,
  ap: overload (
    1,
    <_, A, B>(
      self: IoEither<_, (a: A) => B>,
      fa: IoEither<_, A>,
    ): IoEither<_, B> =>
      () =>
        pipe (
          E.Do,
          E.apS ("a", fromIoEither (fa)),
          E.apS ("ab", fromIoEither (self)),
          E.map (({ a, ab }) => ab (a)),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

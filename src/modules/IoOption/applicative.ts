import * as O from "../Option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { IoOptionHKT, some, fromIoOption, IoOption } from "./io-option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "src/utils/overloads"

export const applicative: Applicative<IoOptionHKT> = createApplicative ({
  ...functor,
  of: some,
  ap: overload (
    1,
    <A, B>(self: IoOption<(a: A) => B>, fma: IoOption<A>): IoOption<B> =>
      () =>
        pipe (
          O.Do,
          O.apS ("a", fromIoOption (fma)),
          O.apS ("ab", fromIoOption (self)),
          O.map (({ a, ab }) => ab (a)),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

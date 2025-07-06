import { createApplicative, Applicative } from "../../types/Applicative"
import { OptionHKT, Option, some } from "./option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { match, zero } from "./utils"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<OptionHKT> = createApplicative ({
  ...functor,
  of: some,
  ap: overload (
    1,
    <_, A, B>(self: Option<(a: A) => B>, fa: Option<A>): Option<B> =>
      match (fa, zero, a =>
        pipe (
          self,
          match (zero, ab => pipe (a, ab, some)),
        ),
      ),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

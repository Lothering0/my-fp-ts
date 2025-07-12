import { createApplicative } from "../../types/Applicative"
import { OptionHKT, Option, some } from "./option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { match, zero } from "./utils"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<OptionHKT> ({
  ...Functor,
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

export const { of, ap, apply, flap, flipApply } = Applicative

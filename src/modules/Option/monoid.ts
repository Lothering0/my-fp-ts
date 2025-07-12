import { Option, none, some } from "./option"
import { isNone } from "./refinements"
import { fromSome } from "./utils"
import { Monoid } from "../../types/Monoid"
import { Semigroup } from "../../types/Semigroup"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const getMonoid: {
  <A>(semigroup: Semigroup<A>): Monoid<Option<A>>
} = s => ({
  empty: none,
  concat: overload (1, (mx, my) =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : pipe (s.concat (fromSome (mx), fromSome (my)), some),
  ),
})

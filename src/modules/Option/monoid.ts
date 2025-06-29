import { Option, none, some } from "./option"
import { Monoid } from "../../types/Monoid"
import { Semigroup } from "../../types/Semigroup"
import { pipe } from "../../utils/flow"
import { fromSome, isNone } from "./utils"

export const getMonoid: {
  <A>(semigroup: Semigroup<A>): Monoid<Option<A>>
} = s => ({
  empty: none,
  concat: (mx, my) =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : pipe (s.concat (fromSome (mx), fromSome (my)), some),
})

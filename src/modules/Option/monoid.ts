import { Option, none, some } from "./option"
import { isNone } from "./refinements"
import { value } from "./utils"
import { Monoid } from "../../typeclasses/Monoid"
import { Semigroup } from "../../typeclasses/Semigroup"
import { pipe } from "../../utils/flow"

export const empty = none

export const getSemigroup: {
  <A>(Semigroup: Semigroup<A>): Semigroup<Option<A>>
} = Semigroup => ({
  combine: mx => my =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : pipe (Semigroup.combine (value (mx)) (value (my)), some),
})

export const getMonoid: {
  <A>(Semigroup: Semigroup<A>): Monoid<Option<A>>
} = Semigroup => ({
  empty: none,
  ...getSemigroup (Semigroup),
})

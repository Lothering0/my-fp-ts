import { Option, none } from "./option"
import { Monoid } from "../../typeclasses/Monoid"
import { Semigroup } from "../../typeclasses/Semigroup"
import { getSemigroup } from "./semigroup"

export const empty = none

export const getMonoid: {
  <A>(Semigroup: Semigroup<A>): Monoid<Option<A>>
} = Semigroup => ({
  empty: none,
  ...getSemigroup (Semigroup),
})

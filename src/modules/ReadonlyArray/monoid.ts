import { Monoid } from "../../typeclasses/Monoid"
import { getSemigroup } from "./semigroup"

export const empty: ReadonlyArray<never> = []

export const getMonoid = <A>(): Monoid<ReadonlyArray<A>> => ({
  ...getSemigroup (),
  empty,
})

import { Monoid } from "../../types/Monoid"
import { getSemigroup } from "./semigroup"

export const getMonoid = <A>(): Monoid<ReadonlyArray<A>> => ({
  ...getSemigroup (),
  empty: [],
})

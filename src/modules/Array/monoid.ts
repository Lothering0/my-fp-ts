import { Monoid } from "../../types/Monoid"
import { getSemigroup } from "./semigroup"

export const getMonoid = <A>(): Monoid<Array<A>> => ({
  ...getSemigroup (),
  empty: [],
})

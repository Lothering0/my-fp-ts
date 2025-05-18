import { Semigroup } from "../../types/Semigroup"
import { NonEmptyArray } from "./non-empty-array"

export const getSemigroup = <A>(): Semigroup<NonEmptyArray<A>> => ({
  concat: (xs, ys) => [...xs, ...ys],
})

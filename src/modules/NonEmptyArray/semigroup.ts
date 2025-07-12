import { Semigroup } from "../../types/Semigroup"
import { NonEmptyArray } from "./non-empty-array"
import { overload } from "../../utils/overloads"

export const getSemigroup = <A>(): Semigroup<NonEmptyArray<A>> => ({
  concat: overload (1, (xs, ys) => [...xs, ...ys]),
})

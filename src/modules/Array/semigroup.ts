import { Semigroup } from "../../types/Semigroup"
import { overload } from "../../utils/overloads"

export const getSemigroup = <A>(): Semigroup<Array<A>> => ({
  concat: overload (1, (xs, ys) => [...xs, ...ys]),
})

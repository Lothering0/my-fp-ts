import { Semigroup } from "../../types/Semigroup"

export const getSemigroup = <A>(): Semigroup<Array<A>> => ({
  concat: (xs, ys) => [...xs, ...ys],
})

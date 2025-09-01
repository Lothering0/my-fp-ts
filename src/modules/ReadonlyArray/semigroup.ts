import { Semigroup } from "../../typeclasses/Semigroup"
import { concat } from "./utils"

export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => ({
  combine: concat,
})

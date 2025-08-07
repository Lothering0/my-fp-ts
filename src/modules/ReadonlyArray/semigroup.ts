import { Semigroup } from "../../types/Semigroup"
import { concat } from "./utils"

export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => ({
  combine: concat,
})

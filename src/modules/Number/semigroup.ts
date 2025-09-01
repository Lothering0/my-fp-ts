import { Semigroup } from "../../typeclasses/Semigroup"
import { add, multiply } from "./utils"

export const SemigroupSum: Semigroup<number> = {
  combine: add,
}

export const SemigroupProduct: Semigroup<number> = {
  combine: multiply,
}

import { Monoid } from "../../typeclasses/Monoid"
import { SemigroupProduct, SemigroupSum } from "./semigroup"

export const MonoidSum: Monoid<number> = {
  ...SemigroupSum,
  empty: 0,
}

export const MonoidProduct: Monoid<number> = {
  ...SemigroupProduct,
  empty: 1,
}

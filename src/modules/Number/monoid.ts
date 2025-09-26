import { Monoid } from "../../typeclasses/Monoid"
import {
  SemigroupMin,
  SemigroupMax,
  SemigroupProduct,
  SemigroupSum,
} from "./semigroup"

export const MonoidSum: Monoid<number> = {
  ...SemigroupSum,
  empty: 0,
}

export const MonoidProduct: Monoid<number> = {
  ...SemigroupProduct,
  empty: 1,
}

export const MonoidMin: Monoid<number> = {
  ...SemigroupMin,
  empty: Infinity,
}

export const MonoidMax: Monoid<number> = {
  ...SemigroupMax,
  empty: -Infinity,
}

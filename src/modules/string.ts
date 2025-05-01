import { Monoid } from "../types/Monoid"
import { Semigroup } from "../types/Semigroup"

export const semigroup: Semigroup<string> = {
  concat: (x, y) => x.concat (y),
}

export const monoid: Monoid<string> = {
  ...semigroup,
  empty: "",
}

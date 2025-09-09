import { Semigroup } from "../../typeclasses/Semigroup"
import { and, or } from "./utils"

export const SemigroupAny: Semigroup<boolean> = {
  combine: or,
}

export const SemigroupAll: Semigroup<boolean> = {
  combine: and,
}

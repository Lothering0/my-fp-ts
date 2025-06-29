import { Comonad } from "../../types/Comonad"
import { NonEmptyArrayHKT } from "./non-empty-array"
import { head } from "./utils"
import { extendable } from "./extendable"

export const comonad: Comonad<NonEmptyArrayHKT> = {
  ...extendable,
  extract: head,
}

export const { extract } = comonad

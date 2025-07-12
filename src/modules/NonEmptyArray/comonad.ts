import * as C from "../../types/Comonad"
import { NonEmptyArrayHKT } from "./non-empty-array"
import { head } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: C.Comonad<NonEmptyArrayHKT> = {
  ...Extendable,
  extract: head,
}

export const { extract } = Comonad

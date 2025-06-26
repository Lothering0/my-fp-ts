import { Comonad } from "../../types/Comonad"
import { URI } from "./non-empty-array"
import { head } from "./utils"
import { extendable } from "./extendable"

export const comonad: Comonad<URI> = {
  ...extendable,
  extract: head,
}

export const { extract } = comonad

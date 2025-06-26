import { Comonad } from "../../types/Comonad"
import { URI } from "./tree"
import { valueOf } from "./utils"
import { extendable } from "./extendable"

export const comonad: Comonad<URI> = {
  ...extendable,
  extract: valueOf,
}

export const { extract } = comonad

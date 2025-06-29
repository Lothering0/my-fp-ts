import { Comonad } from "../../types/Comonad"
import { TreeHKT } from "./tree"
import { valueOf } from "./utils"
import { extendable } from "./extendable"

export const comonad: Comonad<TreeHKT> = {
  ...extendable,
  extract: valueOf,
}

export const { extract } = comonad

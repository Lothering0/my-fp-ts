import * as C from "../../types/Comonad"
import { TreeHKT } from "./tree"
import { valueOf } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: C.Comonad<TreeHKT> = {
  ...Extendable,
  extract: valueOf,
}

export const { extract } = Comonad

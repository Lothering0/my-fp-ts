import * as comonad from "../../types/Comonad"
import { Tree, TreeHKT } from "./tree"
import { valueOf } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: comonad.Comonad<TreeHKT> = {
  ...Extendable,
  extract: valueOf,
}

export const extract: {
  <A>(self: Tree<A>): A
} = Comonad.extract

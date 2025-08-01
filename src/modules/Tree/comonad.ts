import * as comonad from "../../types/Comonad"
import { Tree, TreeHKT } from "./tree"
import { value } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: comonad.Comonad<TreeHKT> = {
  ...Extendable,
  extract: value,
}

export const extract: {
  <A>(self: Tree<A>): A
} = Comonad.extract

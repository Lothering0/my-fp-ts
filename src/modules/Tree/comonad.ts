import * as comonad from "../../types/Comonad"
import { Tree, TreeHkt } from "./tree"
import { value } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: comonad.Comonad<TreeHkt> = {
  ...Extendable,
  extract: value,
}

export const extract: {
  <A>(self: Tree<A>): A
} = Comonad.extract

import * as A from "../Array"
import { Extendable } from "../../types/Extendable"
import { Tree, TreeHKT } from "./tree"
import { functor } from "./functor"
import { forestOf, make } from "./utils"
import { overload } from "../../utils/overloads"

export const extendable: Extendable<TreeHKT> = {
  ...functor,
  extend: overload (
    1,
    <A, B>(self: Tree<A>, fab: (fa: Tree<A>) => B): Tree<B> =>
      make (fab (self), A.map (forestOf (self), extend (fab))),
  ),
}

export const { extend } = extendable

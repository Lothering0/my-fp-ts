import * as A from "../Array"
import { createExtendable } from "../../types/Extendable"
import { Tree, TreeHKT } from "./tree"
import { Functor } from "./functor"
import { forestOf, make } from "./utils"
import { overload } from "../../utils/overloads"

export const Extendable = createExtendable<TreeHKT> ({
  ...Functor,
  extend: overload (
    1,
    <A, B>(self: Tree<A>, fab: (fa: Tree<A>) => B): Tree<B> =>
      make (fab (self), A.map (forestOf (self), extend (fab))),
  ),
})

export const { extend, duplicate } = Extendable

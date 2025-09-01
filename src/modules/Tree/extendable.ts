import * as readonlyArray from "../ReadonlyArray"
import { createExtendable } from "../../typeclasses/Extendable"
import { Tree, TreeHkt } from "./tree"
import { Functor } from "./functor"
import { forest, make } from "./utils"

export const Extendable = createExtendable<TreeHkt> ({
  ...Functor,
  extend: fab => self =>
    make (fab (self), readonlyArray.map (extend (fab)) (forest (self))),
})

export const extend: {
  <A, B>(fab: (fa: Tree<A>) => B): (self: Tree<A>) => Tree<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: Tree<A>): Tree<Tree<A>>
} = Extendable.duplicate

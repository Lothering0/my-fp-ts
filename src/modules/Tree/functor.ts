import * as readonlyArray from "../ReadonlyArray"
import * as functor from "../../types/Functor"
import { Tree, TreeHKT } from "./tree"
import { make, value, forest } from "./utils"
import { pipe } from "../../utils/flow"

export const Functor: functor.Functor<TreeHKT> = {
  map: ab => self =>
    make (pipe (self, value, ab), pipe (self, forest, readonlyArray.map (map (ab)))),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Tree<A>) => Tree<B>
} = Functor.map

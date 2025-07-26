import * as RA from "../ReadonlyArray"
import * as F from "../../types/Functor"
import { Tree, TreeHKT } from "./tree"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const Functor: F.Functor<TreeHKT> = {
  map: ab => self =>
    make (pipe (self, valueOf, ab), RA.map (map (ab)) (forestOf (self))),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Tree<A>) => Tree<B>
} = Functor.map

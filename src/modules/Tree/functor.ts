import * as RA from "../ReadonlyArray"
import * as F from "../../types/Functor"
import { Tree, TreeHKT } from "./tree"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<TreeHKT> = {
  map: overload (
    1,
    <A, B>(self: Tree<A>, ab: (a: A) => B): Tree<B> =>
      make (pipe (self, valueOf, ab), RA.map (forestOf (self), map (ab))),
  ),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Tree<A>) => Tree<B>
  <A, B>(self: Tree<A>, ab: (a: A) => B): Tree<B>
} = Functor.map

import * as A from "../Array"
import { Tree, TreeHKT } from "./tree"
import { make, valueOf, forestOf } from "./utils"
import { Functor } from "../../types/Functor"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<TreeHKT> = {
  map: overload (
    1,
    <A, B>(self: Tree<A>, ab: (a: A) => B): Tree<B> =>
      make (pipe (self, valueOf, ab), A.map (forestOf (self), map (ab))),
  ),
}

export const { map } = functor

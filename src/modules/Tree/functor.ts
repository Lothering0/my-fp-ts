import * as iterable from "../Iterable"
import * as functor from "../../typeclasses/Functor"
import { Tree, TreeHkt } from "./tree"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const Functor: functor.Functor<TreeHkt> = {
  map: ab => self =>
    make (pipe (self, valueOf, ab), pipe (self, forestOf, iterable.map (map (ab)))),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Tree<A>) => Tree<B>
} = Functor.map

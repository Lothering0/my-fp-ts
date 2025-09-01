import * as readonlyArray from "../ReadonlyArray"
import { Tree, TreeHkt } from "./tree"
import { createApplicative } from "../../typeclasses/Applicative"
import { Functor, map } from "./functor"
import { make, value, forest } from "./utils"
import { pipe, flow } from "../../utils/flow"

export const flat: {
  <A>(self: Tree<Tree<A>>): Tree<A>
} = self =>
  make (
    pipe (self, value, value),
    readonlyArray.concat (pipe (self, forest, readonlyArray.map (flat))) (
      pipe (self, value, forest),
    ),
  )

export const Applicative = createApplicative<TreeHkt> ({
  ...Functor,
  of: make,
  ap: fa =>
    flow (
      map (ab => pipe (fa, map (ab))),
      flat,
    ),
})

export const of: {
  <A>(a: A): Tree<A>
} = Applicative.of

export const ap: {
  <A>(fa: Tree<A>): <B>(self: Tree<(a: A) => B>) => Tree<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: Tree<(a: A) => B>): (self: Tree<A>) => Tree<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap

import * as readonlyArray from "../ReadonlyArray"
import { Tree, TreeHKT } from "./tree"
import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const Applicative = createApplicative<TreeHKT> ({
  ...Functor,
  of: make,
  ap: fa => self =>
    make (
      valueOf (self) (valueOf (fa)),
      readonlyArray.concat (
        pipe (
          fa,
          forestOf,
          readonlyArray.map (tree => pipe (self, ap (tree))),
        ),
      ) (pipe (self, forestOf, readonlyArray.map (ap (fa)))),
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

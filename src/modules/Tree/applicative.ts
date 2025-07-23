import * as RA from "../ReadonlyArray"
import { Tree, TreeHKT } from "./tree"
import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { make, valueOf, forestOf } from "./utils"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<TreeHKT> ({
  ...Functor,
  of: make,
  ap: overload (
    1,
    <A, B>(self: Tree<(a: A) => B>, fa: Tree<A>): Tree<B> =>
      make (
        valueOf (self) (valueOf (fa)),
        RA.concat (
          RA.map (forestOf (self), ap (fa)),
          RA.map (forestOf (fa), tree => ap (self, tree)),
        ),
      ),
  ),
})

export const of: {
  <A>(a: A): Tree<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: Tree<A>): (self: Tree<(a: A) => B>) => Tree<B>
  <A, B>(self: Tree<(a: A) => B>, fa: Tree<A>): Tree<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: Tree<A>): (self: Tree<(a: A) => B>) => Tree<B>
  <A, B>(self: Tree<(a: A) => B>, fa: Tree<A>): Tree<B>
} = Applicative.apply

export const flap: {
  <A, B>(fab: Tree<(a: A) => B>): (self: Tree<A>) => Tree<B>
  <A, B>(self: Tree<A>, fab: Tree<(a: A) => B>): Tree<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: Tree<(a: A) => B>): (self: Tree<A>) => Tree<B>
  <A, B>(self: Tree<A>, fab: Tree<(a: A) => B>): Tree<B>
} = Applicative.flipApply

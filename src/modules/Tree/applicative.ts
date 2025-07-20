import { Tree, TreeHKT } from "./tree"
import { createApplicative } from "../../types/Applicative"
import { Functor, map } from "./functor"
import { pipe } from "../../utils/flow"
import { make, valueOf } from "./utils"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<TreeHKT> ({
  ...Functor,
  of: make,
  ap: overload (
    1,
    <A, B>(self: Tree<(a: A) => B>, fa: Tree<A>): Tree<B> =>
      pipe (
        fa,
        map (a => map (self, f => f (a))),
        valueOf,
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

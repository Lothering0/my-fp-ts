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

export const { of, ap, apply, flap, flipApply } = Applicative

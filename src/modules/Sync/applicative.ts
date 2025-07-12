import { Functor, map } from "./functor"
import { SyncHKT, sync, fromSync, Sync } from "./sync"
import { createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<SyncHKT> ({
  ...Functor,
  of: sync,
  ap: overload (
    1,
    <A, B>(self: Sync<(a: A) => B>, fa: Sync<A>): Sync<B> =>
      pipe (fa, map (fromSync (self))),
  ),
})

export const { of, ap, apply, flap, flipApply } = Applicative

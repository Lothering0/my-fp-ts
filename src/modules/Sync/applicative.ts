import { functor, map } from "./functor"
import { SyncHKT, sync, fromSync, Sync } from "./sync"
import { Applicative, createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const applicative: Applicative<SyncHKT> = createApplicative ({
  ...functor,
  of: sync,
  ap: overload (
    1,
    <A, B>(self: Sync<(a: A) => B>, fa: Sync<A>): Sync<B> =>
      pipe (fa, map (fromSync (self))),
  ),
})

export const { of, ap, apply, flap, flipApply } = applicative

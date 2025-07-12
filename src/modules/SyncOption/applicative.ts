import * as O from "../Option"
import { createApplicative } from "../../types/Applicative"
import { SyncOptionHKT, some, fromSyncOption, SyncOption } from "./sync-option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { overload } from "src/utils/overloads"

export const Applicative = createApplicative<SyncOptionHKT> ({
  ...Functor,
  of: some,
  ap: overload (
    1,
    <A, B>(self: SyncOption<(a: A) => B>, fma: SyncOption<A>): SyncOption<B> =>
      () =>
        pipe (
          O.Do,
          O.apS ("a", fromSyncOption (fma)),
          O.apS ("ab", fromSyncOption (self)),
          O.map (({ a, ab }) => ab (a)),
        ),
  ),
})

export const { of, ap, apply, flap, flipApply } = Applicative

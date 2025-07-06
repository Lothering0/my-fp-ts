import * as O from "../Option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { SyncOptionHKT, some, fromSyncOption, SyncOption } from "./sync-option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { overload } from "src/utils/overloads"

export const applicative: Applicative<SyncOptionHKT> = createApplicative ({
  ...functor,
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

export const { of, ap, apply, flap, flipApply } = applicative

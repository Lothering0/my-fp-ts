import * as option from "../Option"
import { createApplicative } from "../../types/Applicative"
import { SyncOptionHKT, some, execute, SyncOption } from "./sync-option"
import { Functor } from "./functor"
import { pipe } from "../../utils/flow"

export const Applicative = createApplicative<SyncOptionHKT> ({
  ...Functor,
  of: some,
  ap: fma => self => () =>
    pipe (
      option.Do,
      option.apS ("a", execute (fma)),
      option.apS ("ab", execute (self)),
      option.map (({ a, ab }) => ab (a)),
    ),
})

export const of: {
  <A>(a: A): SyncOption<A>
} = Applicative.of

export const ap: {
  <A>(fa: SyncOption<A>): <B>(self: SyncOption<(a: A) => B>) => SyncOption<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: SyncOption<(a: A) => B>): (self: SyncOption<A>) => SyncOption<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap

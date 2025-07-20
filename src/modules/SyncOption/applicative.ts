import * as O from "../Option"
import { createApplicative } from "../../types/Applicative"
import { SyncOptionHKT, some, execute, SyncOption } from "./sync-option"
import { Functor } from "./functor"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<SyncOptionHKT> ({
  ...Functor,
  of: some,
  ap: overload (
    1,
    <A, B>(self: SyncOption<(a: A) => B>, fma: SyncOption<A>): SyncOption<B> =>
      () =>
        pipe (
          O.Do,
          O.apS ("a", execute (fma)),
          O.apS ("ab", execute (self)),
          O.map (({ a, ab }) => ab (a)),
        ),
  ),
})

export const of: {
  <A>(a: A): SyncOption<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: SyncOption<A>): (self: SyncOption<(a: A) => B>) => SyncOption<B>
  <A, B>(self: SyncOption<(a: A) => B>, fa: SyncOption<A>): SyncOption<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: SyncOption<A>): (self: SyncOption<(a: A) => B>) => SyncOption<B>
  <A, B>(self: SyncOption<(a: A) => B>, fa: SyncOption<A>): SyncOption<B>
} = Applicative.apply

export const flap: {
  <A, B>(fab: SyncOption<(a: A) => B>): (self: SyncOption<A>) => SyncOption<B>
  <A, B>(self: SyncOption<A>, fab: SyncOption<(a: A) => B>): SyncOption<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: SyncOption<(a: A) => B>): (self: SyncOption<A>) => SyncOption<B>
  <A, B>(self: SyncOption<A>, fab: SyncOption<(a: A) => B>): SyncOption<B>
} = Applicative.flipApply

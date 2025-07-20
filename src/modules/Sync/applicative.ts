import { Functor, map } from "./functor"
import { SyncHKT, sync, execute, Sync } from "./sync"
import { createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<SyncHKT> ({
  ...Functor,
  of: sync,
  ap: overload (
    1,
    <A, B>(self: Sync<(a: A) => B>, fa: Sync<A>): Sync<B> =>
      pipe (fa, map (execute (self))),
  ),
})

export const of: {
  <A>(a: A): Sync<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: Sync<A>): (self: Sync<(a: A) => B>) => Sync<B>
  <A, B>(self: Sync<(a: A) => B>, fa: Sync<A>): Sync<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: Sync<A>): (self: Sync<(a: A) => B>) => Sync<B>
  <A, B>(self: Sync<(a: A) => B>, fa: Sync<A>): Sync<B>
} = Applicative.apply

export const flap: {
  <A, B>(fab: Sync<(a: A) => B>): (self: Sync<A>) => Sync<B>
  <A, B>(self: Sync<A>, fab: Sync<(a: A) => B>): Sync<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: Sync<(a: A) => B>): (self: Sync<A>) => Sync<B>
  <A, B>(self: Sync<A>, fab: Sync<(a: A) => B>): Sync<B>
} = Applicative.flipApply

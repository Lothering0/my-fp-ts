import * as applicative from "../../typeclasses/Applicative"
import * as applicativeWithIndex from "../../typeclasses/ApplicativeWithIndex"
import { ReadonlyArrayHkt } from "./readonly-array"
import { Functor, FunctorWithIndex, map } from "./functor"
import { pipe } from "../../utils/flow"

export const Applicative = applicative.create<ReadonlyArrayHkt> (Functor, {
  of: a => [a],
  ap: fa => self =>
    pipe (
      fa,
      map (a =>
        pipe (
          self,
          map (ab => ab (a)),
        ),
      ),
    ).flat (),
})

export const ApplicativeWithIndex = applicativeWithIndex.create<
  ReadonlyArrayHkt,
  number
> (FunctorWithIndex, Applicative, {
  apWithIndex: fa => self =>
    pipe (
      fa,
      map ((a, i) =>
        pipe (
          self,
          map (ab => ab (a, i)),
        ),
      ),
    ).flat (),
})

export const of: {
  <A>(a: A): ReadonlyArray<A>
} = Applicative.of

export const ap: {
  <A>(
    fa: ReadonlyArray<A>,
  ): <B>(self: ReadonlyArray<(a: A, i: number) => B>) => ReadonlyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(
    fab: ReadonlyArray<(a: A, i: number) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply = flap

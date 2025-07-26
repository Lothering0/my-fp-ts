import { ReadonlyArrayHKT } from "./readonly-array"
import { createApplicative } from "../../types/Applicative"
import { createApplicativeWithIndex } from "../../types/ApplicativeWithIndex"
import { Functor, FunctorWithIndex, map, mapWithIndex } from "./functor"
import { pipe } from "../../utils/flow"

export const Applicative = createApplicative<ReadonlyArrayHKT> ({
  ...Functor,
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

export const ApplicativeWithIndex = createApplicativeWithIndex<
  ReadonlyArrayHKT,
  number
> ({
  ...FunctorWithIndex,
  ...Applicative,
  apWithIndex: fa => self =>
    pipe (
      fa,
      mapWithIndex ((i, a) =>
        pipe (
          self,
          map (ab => ab (i, a)),
        ),
      ),
    ).flat (),
})

export const of: {
  <A>(a: A): ReadonlyArray<A>
} = Applicative.of

export const ap: {
  <A, B>(
    fa: ReadonlyArray<A>,
  ): (self: ReadonlyArray<(a: A) => B>) => ReadonlyArray<B>
} = Applicative.ap

export const apWithIndex: {
  <A>(
    fa: ReadonlyArray<A>,
  ): <B>(self: ReadonlyArray<(i: number, a: A) => B>) => ReadonlyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply = ap

/** Alias for `apWithIndex` */
export const applyWithIndex = apWithIndex

export const flap: {
  <A, B>(
    fab: ReadonlyArray<(a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = Applicative.flap

export const flapWithIndex: {
  <A, B>(
    fab: ReadonlyArray<(i: number, a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply = flap

/** Alias for `flapWithIndex` */
export const flipApplyWithIndex = flapWithIndex

import { ReadonlyArrayHKT } from "./readonly-array"
import { createApplicative } from "../../types/Applicative"
import { createApplicativeWithIndex } from "../../types/ApplicativeWithIndex"
import { Functor, FunctorWithIndex, map, mapWithIndex } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<ReadonlyArrayHKT> ({
  ...Functor,
  of: a => [a],
  ap: overload (
    1,
    <A, B>(self: ReadonlyArray<(a: A) => B>, fa: ReadonlyArray<A>) =>
      map (fa, a => map (self, ab => ab (a))).flat (),
  ),
})

export const ApplicativeWithIndex = createApplicativeWithIndex<
  ReadonlyArrayHKT,
  number
> ({
  ...FunctorWithIndex,
  ...Applicative,
  apWithIndex: overload (
    1,
    <A, B>(self: ReadonlyArray<(i: number, a: A) => B>, fa: ReadonlyArray<A>) =>
      mapWithIndex (fa, (i, a) => map (self, ab => ab (i, a))).flat (),
  ),
})

export const of: {
  <A>(a: A): ReadonlyArray<A>
} = Applicative.of

export const ap: {
  <A, B>(
    fa: ReadonlyArray<A>,
  ): (self: ReadonlyArray<(a: A) => B>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<(a: A) => B>,
    fa: ReadonlyArray<A>,
  ): ReadonlyArray<B>
} = Applicative.ap

export const apWithIndex: {
  <A, B>(
    fa: ReadonlyArray<A>,
  ): (self: ReadonlyArray<(i: number, a: A) => B>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<(i: number, a: A) => B>,
    fa: ReadonlyArray<A>,
  ): ReadonlyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply: {
  <A, B>(
    fa: ReadonlyArray<A>,
  ): (self: ReadonlyArray<(a: A) => B>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<(a: A) => B>,
    fa: ReadonlyArray<A>,
  ): ReadonlyArray<B>
} = Applicative.apply

/** Alias for `apWithIndex` */
export const applyWithIndex: {
  <A, B>(
    fa: ReadonlyArray<A>,
  ): (self: ReadonlyArray<(i: number, a: A) => B>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<(i: number, a: A) => B>,
    fa: ReadonlyArray<A>,
  ): ReadonlyArray<B>
} = ApplicativeWithIndex.applyWithIndex

export const flap: {
  <A, B>(
    fab: ReadonlyArray<(a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<A>,
    fab: ReadonlyArray<(a: A) => B>,
  ): ReadonlyArray<B>
} = Applicative.flap

export const flapWithIndex: {
  <A, B>(
    fab: ReadonlyArray<(i: number, a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<A>,
    fab: ReadonlyArray<(i: number, a: A) => B>,
  ): ReadonlyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply: {
  <A, B>(
    fab: ReadonlyArray<(a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<A>,
    fab: ReadonlyArray<(a: A) => B>,
  ): ReadonlyArray<B>
} = Applicative.flipApply

/** Alias for `flapWithIndex` */
export const flipApplyWithIndex: {
  <A, B>(
    fab: ReadonlyArray<(i: number, a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<A>,
    fab: ReadonlyArray<(i: number, a: A) => B>,
  ): ReadonlyArray<B>
} = ApplicativeWithIndex.flipApplyWithIndex

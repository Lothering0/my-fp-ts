import { ArrayHKT } from "./array"
import { createApplicative } from "../../types/Applicative"
import { createApplicativeWithIndex } from "../../types/ApplicativeWithIndex"
import { Functor, FunctorWithIndex, map, mapWithIndex } from "./functor"
import { overload } from "../../utils/overloads"

export const Applicative = createApplicative<ArrayHKT> ({
  ...Functor,
  of: a => [a],
  ap: overload (1, <A, B>(self: ((a: A) => B)[], fa: A[]) =>
    map (fa, a => map (self, ab => ab (a))).flat (),
  ),
})

export const ApplicativeWithIndex = createApplicativeWithIndex<
  ArrayHKT,
  number
> ({
  ...FunctorWithIndex,
  ...Applicative,
  apWithIndex: overload (1, <A, B>(self: ((i: number, a: A) => B)[], fa: A[]) =>
    mapWithIndex (fa, (i, a) => map (self, ab => ab (i, a))).flat (),
  ),
})

export const of: {
  <A>(a: A): A[]
} = Applicative.of

export const ap: {
  <A, B>(fa: A[]): (self: ((a: A) => B)[]) => B[]
  <A, B>(self: ((a: A) => B)[], fa: A[]): B[]
} = Applicative.ap

export const apWithIndex: {
  <A, B>(fiab: ((i: number, a: A) => B)[]): (self: A[]) => B[]
  <A, B>(fiab: ((i: number, a: A) => B)[], self: A[]): B[]
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: A[]): (self: ((a: A) => B)[]) => B[]
  <A, B>(self: ((a: A) => B)[], fa: A[]): B[]
} = Applicative.apply

/** Alias for `apWithIndex` */
export const applyWithIndex: {
  <A, B>(fa: A[]): (self: ((i: number, a: A) => B)[]) => B[]
  <A, B>(self: ((i: number, a: A) => B)[], fa: A[]): B[]
} = ApplicativeWithIndex.applyWithIndex

export const flap: {
  <A, B>(fab: ((a: A) => B)[]): (self: A[]) => B[]
  <A, B>(self: A[], fab: ((a: A) => B)[]): B[]
} = Applicative.flap

export const flapWithIndex: {
  <A, B>(fab: ((i: number, a: A) => B)[]): (self: A[]) => B[]
  <A, B>(self: A[], fab: ((i: number, a: A) => B)[]): B[]
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: ((a: A) => B)[]): (self: A[]) => B[]
  <A, B>(self: A[], fab: ((a: A) => B)[]): B[]
} = Applicative.flipApply

/** Alias for `flapWithIndex` */
export const flipApplyWithIndex: {
  <A, B>(fab: ((i: number, a: A) => B)[]): (self: A[]) => B[]
  <A, B>(self: A[], fab: ((i: number, a: A) => B)[]): B[]
} = ApplicativeWithIndex.flipApplyWithIndex

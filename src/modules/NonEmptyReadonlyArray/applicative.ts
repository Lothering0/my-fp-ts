import * as readonlyArray from "../ReadonlyArray"
import * as applicative from "../../types/Applicative"
import * as applicativeWithIndex from "../../types/ApplicativeWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"

export const Applicative = {
  ...readonlyArray.Applicative,
} as applicative.Applicative<NonEmptyReadonlyArrayHKT>

export const ApplicativeWithIndex = {
  ...readonlyArray.ApplicativeWithIndex,
} as applicativeWithIndex.ApplicativeWithIndex<NonEmptyReadonlyArrayHKT, number>

export const of: {
  <A>(a: A): NonEmptyReadonlyArray<A>
} = Applicative.of

export const ap: {
  <A>(
    fa: NonEmptyReadonlyArray<A>,
  ): <B>(self: NonEmptyReadonlyArray<(a: A) => B>) => NonEmptyReadonlyArray<B>
} = Applicative.ap

export const apWithIndex: {
  <A>(
    fa: NonEmptyReadonlyArray<A>,
  ): <B>(
    self: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ) => NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply = ap

/** Alias for `apWithIndex` */
export const applyWithIndex = apWithIndex

export const flap: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(a: A) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = Applicative.flap

export const flapWithIndex: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply = flap

/** Alias for `flapWithIndex` */
export const flipApplyWithIndex = flapWithIndex

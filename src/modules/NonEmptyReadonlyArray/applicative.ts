import * as RA from "../ReadonlyArray"
import * as Ap from "../../types/Applicative"
import * as ApI from "../../types/ApplicativeWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"

export const Applicative = {
  ...RA.Applicative,
} as Ap.Applicative<NonEmptyReadonlyArrayHKT>

export const ApplicativeWithIndex = {
  ...RA.ApplicativeWithIndex,
} as ApI.ApplicativeWithIndex<NonEmptyReadonlyArrayHKT, number>

export const of: {
  <A>(a: A): NonEmptyReadonlyArray<A>
} = Applicative.of

export const ap: {
  <A, B>(
    fa: NonEmptyReadonlyArray<A>,
  ): (self: NonEmptyReadonlyArray<(a: A) => B>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<(a: A) => B>,
    fa: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<B>
} = Applicative.ap

export const apWithIndex: {
  <A, B>(
    fa: NonEmptyReadonlyArray<A>,
  ): (
    self: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<(i: number, a: A) => B>,
    fa: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply: {
  <A, B>(
    fa: NonEmptyReadonlyArray<A>,
  ): (self: NonEmptyReadonlyArray<(a: A) => B>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<(a: A) => B>,
    fa: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<B>
} = Applicative.apply

/** Alias for `apWithIndex` */
export const applyWithIndex: {
  <A, B>(
    fa: NonEmptyReadonlyArray<A>,
  ): (
    self: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<(i: number, a: A) => B>,
    fa: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.applyWithIndex

export const flap: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(a: A) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<A>,
    fab: NonEmptyReadonlyArray<(a: A) => B>,
  ): NonEmptyReadonlyArray<B>
} = Applicative.flap

export const flapWithIndex: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<A>,
    fab: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ): NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(a: A) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<A>,
    fab: NonEmptyReadonlyArray<(a: A) => B>,
  ): NonEmptyReadonlyArray<B>
} = Applicative.flipApply

/** Alias for `flapWithIndex` */
export const flipApplyWithIndex: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<A>,
    fab: NonEmptyReadonlyArray<(i: number, a: A) => B>,
  ): NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.flipApplyWithIndex

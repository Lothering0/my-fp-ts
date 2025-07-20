import * as A from "../Array"
import * as Ap from "../../types/Applicative"
import * as ApI from "../../types/ApplicativeWithIndex"
import { NonEmptyArray, NonEmptyArrayHKT } from "./non-empty-array"

export const Applicative = {
  ...A.Applicative,
} as Ap.Applicative<NonEmptyArrayHKT>

export const ApplicativeWithIndex = {
  ...A.ApplicativeWithIndex,
} as ApI.ApplicativeWithIndex<NonEmptyArrayHKT, number>

export const of: {
  <A>(a: A): NonEmptyArray<A>
} = Applicative.of

export const ap: {
  <A, B>(
    fa: NonEmptyArray<A>,
  ): (self: NonEmptyArray<(a: A) => B>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<(a: A) => B>,
    fa: NonEmptyArray<A>,
  ): NonEmptyArray<B>
} = Applicative.ap

export const apWithIndex: {
  <A, B>(
    fiab: NonEmptyArray<(i: number, a: A) => B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    fiab: NonEmptyArray<(i: number, a: A) => B>,
    self: NonEmptyArray<A>,
  ): NonEmptyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply: {
  <A, B>(
    fa: NonEmptyArray<A>,
  ): (self: NonEmptyArray<(a: A) => B>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<(a: A) => B>,
    fa: NonEmptyArray<A>,
  ): NonEmptyArray<B>
} = Applicative.apply

/** Alias for `apWithIndex` */
export const applyWithIndex: {
  <A, B>(
    fa: NonEmptyArray<A>,
  ): (self: NonEmptyArray<(i: number, a: A) => B>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<(i: number, a: A) => B>,
    fa: NonEmptyArray<A>,
  ): NonEmptyArray<B>
} = ApplicativeWithIndex.applyWithIndex

export const flap: {
  <A, B>(
    fab: NonEmptyArray<(a: A) => B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<A>,
    fab: NonEmptyArray<(a: A) => B>,
  ): NonEmptyArray<B>
} = Applicative.flap

export const flapWithIndex: {
  <A, B>(
    fab: NonEmptyArray<(i: number, a: A) => B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<A>,
    fab: NonEmptyArray<(i: number, a: A) => B>,
  ): NonEmptyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply: {
  <A, B>(
    fab: NonEmptyArray<(a: A) => B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<A>,
    fab: NonEmptyArray<(a: A) => B>,
  ): NonEmptyArray<B>
} = Applicative.flipApply

/** Alias for `flapWithIndex` */
export const flipApplyWithIndex: {
  <A, B>(
    fab: NonEmptyArray<(i: number, a: A) => B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<A>,
    fab: NonEmptyArray<(i: number, a: A) => B>,
  ): NonEmptyArray<B>
} = ApplicativeWithIndex.flipApplyWithIndex

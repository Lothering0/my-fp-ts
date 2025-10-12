import * as Array from '../ReadonlyArray'
import * as Zippable_ from '../../typeclasses/Zippable'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Zippable = {
  ...Array.Zippable,
} as Zippable_.Zippable<NonEmptyReadonlyArrayHkt>

export const zipWith: {
  <A, B, C>(
    bs: NonEmptyReadonlyArray<B>,
    abic: (a: A, b: B, i: number) => C,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<C>
} = Array.zipWith as typeof zipWith

export const zip: {
  <A, B>(
    bs: NonEmptyReadonlyArray<B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<readonly [A, B]>
} = Array.zip as typeof zip

export const unzip: {
  <A, B>(
    zipped: NonEmptyReadonlyArray<readonly [A, B]>,
  ): readonly [NonEmptyReadonlyArray<A>, NonEmptyReadonlyArray<B>]
} = Array.unzip as typeof unzip

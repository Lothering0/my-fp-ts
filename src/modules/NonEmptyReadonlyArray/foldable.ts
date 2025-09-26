import * as array from '../ReadonlyArray'
import * as foldable from '../../typeclasses/Foldable'
import * as foldableWithIndex from '../../typeclasses/FoldableWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Foldable = {
  ...array.Foldable,
} as foldable.Foldable<NonEmptyReadonlyArrayHkt>

export const FoldableWithIndex = {
  ...array.FoldableWithIndex,
} as foldableWithIndex.FoldableWithIndex<NonEmptyReadonlyArrayHkt, number>

export const reduce: {
  <A, B>(
    b: B,
    baib: (b: B, a: A, i: number) => B,
  ): (self: NonEmptyReadonlyArray<A>) => B
} = FoldableWithIndex.reduceWithIndex

export const reduceRight: {
  <A, B>(
    b: B,
    abib: (a: A, b: B, i: number) => B,
  ): (self: NonEmptyReadonlyArray<A>) => B
} = FoldableWithIndex.reduceRightWithIndex

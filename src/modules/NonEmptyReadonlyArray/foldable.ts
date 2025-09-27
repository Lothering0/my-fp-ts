import * as Array from '../ReadonlyArray'
import * as Foldable_ from '../../typeclasses/Foldable'
import * as FoldableWithIndex_ from '../../typeclasses/FoldableWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Foldable = {
  ...Array.Foldable,
} as Foldable_.Foldable<NonEmptyReadonlyArrayHkt>

export const FoldableWithIndex = {
  ...Array.FoldableWithIndex,
} as FoldableWithIndex_.FoldableWithIndex<NonEmptyReadonlyArrayHkt, number>

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

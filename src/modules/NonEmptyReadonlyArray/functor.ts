import * as array from '../ReadonlyArray'
import * as functor from '../../typeclasses/Functor'
import * as functorWithIndex from '../../typeclasses/FunctorWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Functor = {
  ...array.Functor,
} as functor.Functor<NonEmptyReadonlyArrayHkt>

export const FunctorWithIndex = {
  ...array.FunctorWithIndex,
} as functorWithIndex.FunctorWithIndex<NonEmptyReadonlyArrayHkt, number>

export const map: {
  <A, B>(
    aib: (a: A, i: number) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex

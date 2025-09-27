import * as Array from '../ReadonlyArray'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Functor = {
  ...Array.Functor,
} as Functor_.Functor<NonEmptyReadonlyArrayHkt>

export const FunctorWithIndex = {
  ...Array.FunctorWithIndex,
} as FunctorWithIndex_.FunctorWithIndex<NonEmptyReadonlyArrayHkt, number>

export const map: {
  <A, B>(
    aib: (a: A, i: number) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex

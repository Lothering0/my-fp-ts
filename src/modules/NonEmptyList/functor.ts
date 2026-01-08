import * as List from '../List'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'

export const Functor = {
  ...List.Functor,
} as Functor_.Functor<NonEmptyListHkt>

export const FunctorWithIndex = {
  ...List.FunctorWithIndex,
} as FunctorWithIndex_.FunctorWithIndex<NonEmptyListHkt, number>

export const map: {
  <A, B>(
    aib: (a: A, i: number) => B,
  ): (list: NonEmptyList<A>) => NonEmptyList<B>
} = FunctorWithIndex.mapWithIndex

export const as: {
  <A>(a: A): (list: NonEmptyList<unknown>) => NonEmptyList<A>
} = FunctorWithIndex.as

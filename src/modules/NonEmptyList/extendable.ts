import * as List from '../List'
import * as Extendable_ from '../../typeclasses/Extendable'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'

export const Extendable = {
  ...List.Extendable,
} as Extendable_.Extendable<NonEmptyListHkt>

export const extend: {
  <A, B>(
    fab: (fa: NonEmptyList<A>) => B,
  ): (list: NonEmptyList<A>) => NonEmptyList<B>
} = Extendable.extend

export const duplicate: {
  <A>(list: NonEmptyList<A>): NonEmptyList<NonEmptyList<A>>
} = Extendable.duplicate

import * as Array from '../ReadonlyArray'
import * as Extendable_ from '../../typeclasses/Extendable'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Extendable = {
  ...Array.Extendable,
} as Extendable_.Extendable<NonEmptyReadonlyArrayHkt>

export const extend: {
  <A, B>(
    fab: (fa: NonEmptyReadonlyArray<A>) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = Extendable.extend

export const duplicate: {
  <A>(
    self: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
} = Extendable.duplicate

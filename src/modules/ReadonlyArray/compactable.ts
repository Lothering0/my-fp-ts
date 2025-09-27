import * as Option from '../Option'
import * as Result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { ReadonlyArrayHkt } from './readonly-array'
import { of } from './applicative'
import { flatMap } from './monad'
import { constEmptyArray } from '../../utils/constant'
import { Functor } from './functor'

export const Compactable = create<ReadonlyArrayHkt>(Functor, {
  compact: flatMap(
    Option.match({
      onNone: constEmptyArray,
      onSome: of,
    }),
  ),
})

export const compact: {
  <A>(self: ReadonlyArray<Option.Option<A>>): ReadonlyArray<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: ReadonlyArray<Result.Result<A, unknown>>): ReadonlyArray<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    self: ReadonlyArray<Result.Result<A, E>>,
  ): readonly [ReadonlyArray<A>, ReadonlyArray<E>]
} = Compactable.separate

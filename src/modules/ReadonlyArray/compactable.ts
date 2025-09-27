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
  <A>(self: ReadonlyArray<Result.Result<unknown, A>>): ReadonlyArray<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: ReadonlyArray<Result.Result<E, A>>,
  ): readonly [ReadonlyArray<E>, ReadonlyArray<A>]
} = Compactable.separate

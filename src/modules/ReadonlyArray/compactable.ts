import * as Array from './readonly-array'
import * as Option from '../Option'
import * as Result from '../Result'
import * as Compactable_ from '../../typeclasses/Compactable'
import { of } from './from-identity'
import { flatMap } from './monad'
import { constEmptyArray } from '../../utils/constant'
import { Functor } from './functor'

export const Compactable = Compactable_.create<Array.Hkt>(Functor, {
  compact: flatMap(
    Option.match({
      onNone: constEmptyArray,
      onSome: of,
    }),
  ),
})

export const compact: {
  <A>(array: ReadonlyArray<Option.Option<A>>): ReadonlyArray<A>
} = Compactable.compact

export const compactResults: {
  <A>(array: ReadonlyArray<Result.Result<A, unknown>>): ReadonlyArray<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    array: ReadonlyArray<Result.Result<A, E>>,
  ): readonly [ReadonlyArray<A>, ReadonlyArray<E>]
} = Compactable.separate

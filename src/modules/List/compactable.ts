import * as Option from '../Option'
import * as Result from '../Result'
import * as List from './list'
import { create } from '../../typeclasses/Compactable'
import { of } from './from-identity'
import { flatMap } from './monad'
import { Functor } from './functor'

export const Compactable = create<List.ListHkt>(Functor, {
  compact: flatMap(
    Option.match({
      onNone: () => List.nil(),
      onSome: of,
    }),
  ),
})

export const compact: {
  <A>(list: List.List<Option.Option<A>>): List.List<A>
} = Compactable.compact

export const compactResults: {
  <A>(list: List.List<Result.Result<A, unknown>>): List.List<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    list: List.List<Result.Result<A, E>>,
  ): readonly [List.List<A>, List.List<E>]
} = Compactable.separate

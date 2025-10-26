import * as Option from '../Option'
import * as Result from '../Result'
import { Compactable as Compactable_ } from '../../typeclasses/Compactable'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { _AsyncOption } from './_internal'

export const Compactable: Compactable_<AsyncOptionHkt> =
  _AsyncOption.Compactable

export const compact: {
  <A>(self: AsyncOption<Option.Option<A>>): AsyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: AsyncOption<Result.Result<A, unknown>>): AsyncOption<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    self: AsyncOption<Result.Result<A, E>>,
  ): readonly [AsyncOption<A>, AsyncOption<E>]
} = Compactable.separate

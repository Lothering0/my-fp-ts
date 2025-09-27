import * as Result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { Option, OptionHkt } from './option'
import { flat } from './monad'
import { Functor } from './functor'

export const Compactable = create<OptionHkt>(Functor, {
  compact: flat,
})

export const compact: {
  <A>(self: Option<Option<A>>): Option<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Option<Result.Result<A, unknown>>): Option<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(self: Option<Result.Result<A, E>>): readonly [Option<A>, Option<E>]
} = Compactable.separate

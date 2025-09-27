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
  <A>(self: Option<Result.Result<unknown, A>>): Option<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(self: Option<Result.Result<E, A>>): readonly [Option<E>, Option<A>]
} = Compactable.separate

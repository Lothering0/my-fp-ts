import { create } from '../../typeclasses/Extendable'
import { Option, OptionHkt } from './option'
import { Functor, as } from './functor'

export const Extendable = create<OptionHkt>(Functor, {
  extend: fab => self => as(fab(self))(self),
})

export const extend: {
  <A, B>(fab: (fa: Option<A>) => B): (self: Option<A>) => Option<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: Option<A>): Option<Option<A>>
} = Extendable.duplicate

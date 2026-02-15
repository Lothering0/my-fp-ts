import { create } from '../../typeclasses/Extendable'
import { Option, Hkt } from './option'
import { Functor, as } from './functor'

export const Extendable = create<Hkt>(Functor, {
  extend: fab => option => as(fab(option))(option),
})

export const extend: {
  <A, B>(fab: (fa: Option<A>) => B): (option: Option<A>) => Option<B>
} = Extendable.extend

export const duplicate: {
  <A>(option: Option<A>): Option<Option<A>>
} = Extendable.duplicate

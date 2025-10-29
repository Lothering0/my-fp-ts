import { create } from '../../typeclasses/Extendable'
import { Result, ResultHkt } from './result'
import { Functor, as } from './functor'

export const Extendable = create<ResultHkt>(Functor, {
  extend: fab => self => as(fab(self))(self),
})

export const extend: {
  <A, B, E>(fab: (fa: Result<A, E>) => B): (self: Result<A, E>) => Result<B, E>
} = Extendable.extend

export const duplicate: {
  <A, E>(self: Result<A, E>): Result<Result<A, E>, E>
} = Extendable.duplicate

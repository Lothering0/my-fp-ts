import { create } from '../../typeclasses/Extendable'
import { Result, Hkt } from './result'
import { Functor, as } from './functor'

export const Extendable = create<Hkt>(Functor, {
  extend: fab => result => as(fab(result))(result),
})

export const extend: {
  <A, B, E>(
    fab: (fa: Result<A, E>) => B,
  ): (result: Result<A, E>) => Result<B, E>
} = Extendable.extend

export const duplicate: {
  <A, E>(result: Result<A, E>): Result<Result<A, E>, E>
} = Extendable.duplicate

import { create } from '../../typeclasses/Extendable'
import { Result, ResultHkt } from './result'
import { Functor, map } from './functor'

export const Extendable = create<ResultHkt>(Functor, {
  extend: fab => self => map(() => fab(self))(self),
})

export const extend: {
  <Failure, In, Out>(
    fab: (fa: Result<Failure, In>) => Out,
  ): (self: Result<Failure, In>) => Result<Failure, Out>
} = Extendable.extend

export const duplicate: {
  <Failure, Out>(
    self: Result<Failure, Out>,
  ): Result<Failure, Result<Failure, Out>>
} = Extendable.duplicate

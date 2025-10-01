import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { Result, ResultHkt } from './result'

export const Applicative = create<ResultHkt>(Monad)

export const apply: {
  <A, E1>(
    fa: Result<A, E1>,
  ): <B, E2>(self: Result<(a: A) => B, E2>) => Result<B, E1 | E2>
} = Applicative.apply

export const flipApply: {
  <A, B, E1>(
    fab: Result<(a: A) => B, E1>,
  ): <E2>(self: Result<A, E2>) => Result<B, E1 | E2>
} = Applicative.flipApply

import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { Result, ResultHkt } from './result'

export const Applicative = create<ResultHkt>(Monad)

export const apply: {
  <A, E1>(
    result: Result<A, E1>,
  ): <B, E2>(selfResult: Result<(a: A) => B, E2>) => Result<B, E1 | E2>
} = Applicative.apply

export const flipApply: {
  <A, B, E1>(
    result: Result<(a: A) => B, E1>,
  ): <E2>(selfResult: Result<A, E2>) => Result<B, E1 | E2>
} = Applicative.flipApply

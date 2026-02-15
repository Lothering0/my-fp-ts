import { Result, Hkt } from '../Result'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { identity } from '../Identity'

export const FromResult: FromResult_<Hkt> = {
  fromResult: identity,
}

export const fromResult: {
  <A, E>(result: Result<A, E>): Result<A, E>
} = FromResult.fromResult

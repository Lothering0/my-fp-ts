import { Result, ResultHkt } from '../Result'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { identity } from '../Identity'

export const FromResult: FromResult_<ResultHkt> = {
  fromResult: identity,
}

export const fromResult: {
  <A, E>(ma: Result<A, E>): Result<A, E>
} = FromResult.fromResult

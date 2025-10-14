import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { _AsyncOption } from './internal'

export const FromResult: FromResult_<AsyncOptionHkt> = _AsyncOption.FromResult

export const fromResult: {
  <A, E>(ma: Result<A, E>): AsyncOption<A>
} = FromResult.fromResult

import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { AsyncOption, Hkt } from './async-option'
import { _AsyncOption } from './_internal'

export const FromResult: FromResult_<Hkt> = _AsyncOption.FromResult

export const fromResult: {
  <A, E>(result: Result<A, E>): AsyncOption<A>
} = FromResult.fromResult

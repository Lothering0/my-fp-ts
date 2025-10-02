import * as Option from '../Option'
import * as Async from '../Async'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { flow } from '../../utils/flow'

export const FromResult: FromResult_<AsyncOptionHkt> = {
  fromResult: flow(Option.fromResult, Async.of),
}

export const fromResult: {
  <A, E>(ma: Result<A, E>): AsyncOption<A>
} = FromResult.fromResult

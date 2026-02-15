import * as Stream from './stream'
import * as Result from '../Result'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { fail, succeed } from './utils'

export const FromResult: FromResult_<Stream.Hkt> = {
  fromResult: Result.match({
    onSuccess: succeed,
    onFailure: fail,
  }),
}

export const fromResult: {
  <A, E>(result: Result.Result<A, E>): Stream.Stream<A, E>
} = FromResult.fromResult

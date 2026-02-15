import { Result, Failure, Success } from './result'
import { isRecord } from '../../utils/typeChecks'

export const isResult = (x: unknown): x is Result<unknown, unknown> =>
  isRecord(x) && x._id === 'Result'

export const isFailure: {
  <E>(result: Result<unknown, E>): result is Failure<E>
} = result => result._tag === 'Failure'

export const isSuccess: {
  <A>(result: Result<A, unknown>): result is Success<A>
} = result => result._tag === 'Success'

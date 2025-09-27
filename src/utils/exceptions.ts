import * as Result from '../modules/Result'
import { LazyArg } from '../types/utils'

export const raise: {
  <A>(a: A): never
} = a => {
  throw a
}

export const tryDo: {
  <A, E>(a: LazyArg<A>): Result.Result<A, E>
} = a => {
  try {
    return Result.succeed(a())
  } catch (exception) {
    return Result.fail(exception)
  }
}

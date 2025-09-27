import * as Result from '../modules/Result'
import { LazyArg } from '../types/utils'

export const raise: {
  <In>(a: In): never
} = a => {
  throw a
}

export const tryDo: {
  <Collectable, Out>(a: LazyArg<Out>): Result.Result<Collectable, Out>
} = a => {
  try {
    return Result.succeed(a())
  } catch (exception) {
    return Result.fail(exception)
  }
}

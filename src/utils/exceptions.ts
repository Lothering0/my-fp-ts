import * as result from "../modules/Result"
import { LazyArg } from "../types/utils"

export const raise: {
  <A>(a: A): never
} = a => {
  throw a
}

export const tryDo: {
  <E, A>(a: LazyArg<A>): result.Result<E, A>
} = a => {
  try {
    return result.success (a ())
  } catch (exception) {
    return result.failure (exception)
  }
}

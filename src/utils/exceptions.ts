import { LazyArg } from "../types/utils"
import * as R from "../modules/Result"

export const raise: {
  <A>(a: A): never
} = a => {
  throw a
}

export const tryDo: {
  <E, A>(a: LazyArg<A>): R.Result<E, A>
} = a => {
  try {
    return R.success (a ())
  } catch (exception) {
    return R.failure (exception)
  }
}

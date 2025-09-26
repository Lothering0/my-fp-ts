import * as result from "../modules/Result"
import { LazyArg } from "../types/utils"

export const raise: {
  <In>(a: In): never
} = a => {
  throw a
}

export const tryDo: {
  <Collectable, Out>(a: LazyArg<Out>): result.Result<Collectable, Out>
} = a => {
  try {
    return result.succeed (a ())
  } catch (exception) {
    return result.fail (exception)
  }
}

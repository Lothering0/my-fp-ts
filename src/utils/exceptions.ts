import { LazyArg } from "../types/utils"
import * as E from "../modules/Either"

export const raise: {
  <A>(a: A): never
} = a => {
  throw a
}

export const tryDo: {
  <E, A>(a: LazyArg<A>): E.Either<E, A>
} = a => {
  try {
    return E.right (a ())
  } catch (exception) {
    return E.left (exception)
  }
}

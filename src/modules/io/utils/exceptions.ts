import { IO } from "../io"
import * as E from "../../either"

type Raise = <A>(a: A) => IO<never>
export const raise: Raise = a => {
  throw a
}

type TryDo = <E, A>(f: () => A) => E.Either<E, A>
export const tryDo: TryDo = <E, A>(f: () => A) => {
  try {
    return E.right (f ())
  } catch (exception) {
    return E.left (exception as E)
  }
}

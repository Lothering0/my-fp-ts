import * as E from "../Either"
import * as Io from "../Io"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { fromIoEither, IoEither } from "./io-either"

export const toUnion: {
  <E, A>(ma: IoEither<E, A>): Io.Io<E | A>
} = mma => () => E.toUnion (mma ())

export const match: {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (self: IoEither<E, A>) => Io.Io<B>
  <E, A, B>(
    self: IoEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): Io.Io<B>
} = overload (2, (self, whenLeft, whenRight) =>
  pipe (self, fromIoEither, E.match (whenLeft, whenRight), Io.of),
)

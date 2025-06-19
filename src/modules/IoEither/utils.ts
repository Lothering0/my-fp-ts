import * as E from "../Either"
import * as Io from "../Io"
import { pipe } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"
import { fromIoEither, IoEither } from "./io-either"

type ToUnion = <E, A>(ma: IoEither<E, A>) => Io.Io<E | A>
export const toUnion: ToUnion = mma => () => E.toUnion (mma ())

interface MatchPointed {
  <E, A, B>(
    mma: IoEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): Io.Io<B>
}

interface Match extends MatchPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: IoEither<E, A>) => Io.Io<B>
}

const matchPointed: MatchPointed = (mma, f, g) =>
  pipe (mma, fromIoEither, E.match (f, g), Io.of)

export const match: Match = overload2 (matchPointed)

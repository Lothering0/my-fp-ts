import * as E from "../Either"
import { createMonad, Monad } from "../../types/Monad"
import { IoEitherHKT, fromIoEither, IoEither } from "./io-either"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const monad: Monad<IoEitherHKT> = createMonad ({
  ...applicative,
  flat:
    <E, A>(mma: IoEither<E, IoEither<E, A>>) =>
    () =>
      pipe (mma, fromIoEither, ma =>
        E.isLeft (ma) ? ma : pipe (ma, E.fromRight, fromIoEither),
      ),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad

export const tapEither: {
  <E, A, _>(
    f: (a: A) => E.Either<E, _>,
  ): (self: IoEither<E, A>) => IoEither<E, A>
  <E, A, _>(self: IoEither<E, A>, f: (a: A) => E.Either<E, _>): IoEither<E, A>
} = overload (1, (self, f) => () => pipe (self, fromIoEither, E.tap (f)))

import * as E from "../Either"
import { createMonad2, Monad2 } from "../../types/Monad"
import { _URI, fromIoEither, IoEither } from "./io-either"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const monad: Monad2<typeof _URI> = createMonad2 ({
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

interface TapEitherPointed {
  <E, A, _>(ma: IoEither<E, A>, f: (a: A) => E.Either<E, _>): IoEither<E, A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => E.Either<E, _>): (ma: IoEither<E, A>) => IoEither<E, A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) => () =>
  pipe (mma (), E.tap (f))

export const tapEither: TapEither = overload (tapEitherPointed)

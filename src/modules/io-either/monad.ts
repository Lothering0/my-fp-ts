import * as E from "../either"
import { createMonad2, Monad2 } from "../../types/Monad"
import { _URI, fromIoEither, IOEither } from "./io-either"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad2<typeof _URI> = createMonad2 ({
  ...applicative,
  flat:
    <E, A>(mma: IOEither<E, IOEither<E, A>>) =>
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
  applyResultTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad

interface TapEitherPointed {
  <E, A, _>(ma: IOEither<E, A>, f: (a: A) => E.Either<E, _>): IOEither<E, A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => E.Either<E, _>): (ma: IOEither<E, A>) => IOEither<E, A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) => () =>
  pipe (mma (), E.tap (f))

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)

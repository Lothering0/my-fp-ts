import * as IoE from "../IoEither"
import * as O from "../Option"
import { Either } from "../Either"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { URI, fromIoOption, IoOption } from "./io-option"
import { overload } from "../../utils/overloads"

export const monad: Monad<URI> = createMonad ({
  ...applicative,
  flat:
    <A>(mma: IoOption<IoOption<A>>) =>
    () =>
      pipe (mma, fromIoOption, ma =>
        O.isNone (ma) ? ma : pipe (ma, O.fromSome, fromIoOption),
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

interface TapOptionPointed {
  <A, _>(ma: IoOption<A>, f: (a: A) => O.Option<_>): IoOption<A>
}

interface TapOption extends TapOptionPointed {
  <A, _>(f: (a: A) => O.Option<_>): (ma: IoOption<A>) => IoOption<A>
}

const tapOptionPointed: TapOptionPointed = (mma, f) => () =>
  pipe (mma (), O.tap (f))

export const tapOption: TapOption = overload (1, tapOptionPointed)

interface TapEitherPointed {
  <E, A, _>(ma: IoOption<A>, f: (a: A) => Either<E, _>): IoOption<A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => Either<E, _>): (ma: IoOption<A>) => IoOption<A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) => () =>
  pipe (mma (), O.tapEither (f))

export const tapEither: TapEither = overload (1, tapEitherPointed)

interface TapIoEitherPointed {
  <E, A, _>(ma: IoOption<A>, f: (a: A) => IoE.IoEither<E, _>): IoOption<A>
}

interface TapIoEither extends TapIoEitherPointed {
  <E, A, _>(f: (a: A) => IoE.IoEither<E, _>): (ma: IoOption<A>) => IoOption<A>
}

const tapIoEitherPointed: TapIoEitherPointed = (mma, f) => () =>
  pipe (
    mma (),
    O.tap (a => pipe (a, f, IoE.fromIoEither, O.fromEither)),
  )

export const tapIoEither: TapIoEither = overload (1, tapIoEitherPointed)

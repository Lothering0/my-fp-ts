import * as IoE from "../IoEither"
import * as O from "../Option"
import { Either } from "../Either"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { IoOptionHKT, fromIoOption, IoOption } from "./io-option"
import { overload } from "../../utils/overloads"

export const monad: Monad<IoOptionHKT> = createMonad ({
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

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: IoOption<A>) => IoOption<A>
  <A, _>(self: IoOption<A>, f: (a: A) => O.Option<_>): IoOption<A>
} = overload (1, (mma, f) => () => pipe (mma (), O.tap (f)))

export const tapEither: {
  <E, A, _>(f: (a: A) => Either<E, _>): (self: IoOption<A>) => IoOption<A>
  <E, A, _>(self: IoOption<A>, f: (a: A) => Either<E, _>): IoOption<A>
} = overload (1, (mma, f) => () => pipe (mma (), O.tapEither (f)))

export const tapIoEither: {
  <E, A, _>(f: (a: A) => IoE.IoEither<E, _>): (ma: IoOption<A>) => IoOption<A>
  <E, A, _>(ma: IoOption<A>, f: (a: A) => IoE.IoEither<E, _>): IoOption<A>
} = overload (
  1,
  (mma, f) => () =>
    pipe (
      mma (),
      O.tap (a => pipe (a, f, IoE.fromIoEither, O.fromEither)),
    ),
)

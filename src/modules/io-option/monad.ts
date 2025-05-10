import * as IOE from "../io-either"
import * as O from "../option"
import { Either } from "../either"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { fromIoOption, IOOption } from "./io-option"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad<"IOOption"> = createMonad ({
  ...applicative,
  flat:
    <A>(mma: IOOption<IOOption<A>>) =>
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
  applyResultTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad

interface TapOptionPointed {
  <A, _>(ma: IOOption<A>, f: (a: A) => O.Option<_>): IOOption<A>
}

interface TapOption extends TapOptionPointed {
  <A, _>(f: (a: A) => O.Option<_>): (ma: IOOption<A>) => IOOption<A>
}

const tapOptionPointed: TapOptionPointed = (mma, f) => () =>
  pipe (mma (), O.tap (f))

export const tapOption: TapOption = overloadWithPointFree (tapOptionPointed)

interface TapEitherPointed {
  <E, A, _>(ma: IOOption<A>, f: (a: A) => Either<E, _>): IOOption<A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => Either<E, _>): (ma: IOOption<A>) => IOOption<A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) => () =>
  pipe (mma (), O.tapEither (f))

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)

interface TapIOEitherPointed {
  <E, A, _>(ma: IOOption<A>, f: (a: A) => IOE.IOEither<E, _>): IOOption<A>
}

interface TapIOEither extends TapIOEitherPointed {
  <E, A, _>(f: (a: A) => IOE.IOEither<E, _>): (ma: IOOption<A>) => IOOption<A>
}

const tapIoEitherPointed: TapIOEitherPointed = (mma, f) => () =>
  pipe (
    mma (),
    O.tap (a => pipe (a, f, IOE.fromIoEither, O.fromEither)),
  )

export const tapIoEither: TapIOEither =
  overloadWithPointFree (tapIoEitherPointed)

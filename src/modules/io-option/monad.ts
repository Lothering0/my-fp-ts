import * as IOE from "../io-either"
import * as O from "../option"
import { Either } from "../either"
import { createMonad, Monad } from "../../types/Monad"
import { functor } from "./functor"
import { pipe } from "../../utils/pipe"
import { fromIoOption, IOOption } from "./io-option"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad<"IOOption"> = createMonad (functor) ({
  _URI: "IOOption",
  flat: mma => () =>
    pipe (mma, fromIoOption, ma =>
      O.isNone (ma) ? ma : fromIoOption (O.fromSome (ma)),
    ),
})

export const {
  Do,
  flat,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
} = monad

interface TapOptionPointed {
  <A, _>(ma: IOOption<A>, f: (a: A) => O.Option<_>): IOOption<A>
}

interface TapOption extends TapOptionPointed {
  <A, _>(f: (a: A) => O.Option<_>): (ma: IOOption<A>) => IOOption<A>
}

const tapOptionPointed: TapOptionPointed = (mma, f) => () => O.tap (mma (), f)

export const tapOption: TapOption = overloadWithPointFree (tapOptionPointed)

interface TapEitherPointed {
  <E, A, _>(ma: IOOption<A>, f: (a: A) => Either<E, _>): IOOption<A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => Either<E, _>): (ma: IOOption<A>) => IOOption<A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) => () =>
  O.tapEither (mma (), f)

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)

interface TapIOEitherPointed {
  <E, A, _>(ma: IOOption<A>, f: (a: A) => IOE.IOEither<E, _>): IOOption<A>
}

interface TapIOEither extends TapIOEitherPointed {
  <E, A, _>(f: (a: A) => IOE.IOEither<E, _>): (ma: IOOption<A>) => IOOption<A>
}

const tapIoEitherPointed: TapIOEitherPointed = (mma, f) => () =>
  O.tap (mma (), a => pipe (a, f, IOE.fromIoEither, O.fromEither))

export const tapIoEither: TapIOEither =
  overloadWithPointFree (tapIoEitherPointed)

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "../either"
import { createMonad2, Monad2 } from "../../types/Monad"
import { fromIoEither, IOEither } from "./io-either"
import { functor, pure, map } from "./functor"
import { pipe } from "../../utils/pipe"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad2<"IOEither"> = createMonad2 (functor) ({
  _URI: "IOEither",
  flat: mma => () =>
    pipe (mma, fromIoEither, ma =>
      E.isLeft (ma) ? ma : fromIoEither (E.fromRight (ma)),
    ),
  bind: (mma, f) =>
    pipe (
      Do,
      apS ("a", mma),
      map (({ a }) => f (a)),
      flat,
    ),
  tap: (mma, f) =>
    pipe (
      Do,
      apS ("a", mma),
      bind (({ a }) => bind (f (a), () => pure (a))),
    ),
  tapIo: (mma, f) =>
    pipe (
      Do,
      apS ("a", mma),
      bind (({ a }) => bind (pure (f (a)), () => pure (a))),
    ),
  applyTo: (fa, name, ff) =>
    pipe (
      Do,
      apS ("a", fa),
      apS ("f", ff),
      map (({ a, f }) => ({ [name]: f (a), ...a }) as any),
    ),
  applyResultTo: (fa, name, fb) => () =>
    ({ [name]: fromIoEither (fb), ...fromIoEither (fa) }) as any,
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

interface TapEitherPointed {
  <E, A, _>(ma: IOEither<E, A>, f: (a: A) => E.Either<E, _>): IOEither<E, A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => E.Either<E, _>): (ma: IOEither<E, A>) => IOEither<E, A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) => () => E.tap (mma (), f)

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)

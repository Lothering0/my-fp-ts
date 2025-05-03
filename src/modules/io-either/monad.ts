/* eslint-disable @typescript-eslint/no-explicit-any */
import * as IO from "../io"
import * as E from "../either"
import { createMonad2, Monad2 } from "../../types/Monad"
import { fromIoEither, IOEither } from "./io-either"
import { functor, map } from "./functor"
import { pipe } from "../../utils/pipe"

export const monad: Monad2<"IOEither"> = createMonad2 (functor) ({
  _URI: "IOEither",
  flat: mma => () =>
    pipe (mma, fromIoEither, ma =>
      E.isLeft (ma) ? ma : fromIoEither (E.fromRight (ma)),
    ),
  bind: (mma, f) =>
    pipe (mma, fromIoEither, ma =>
      E.isLeft (ma) ? () => ma : f (E.fromRight (ma)),
    ),
  tap:
    <E, A, B>(
      mma: IOEither<E, A>,
      f: (a: A) => IOEither<E, B>,
    ): IOEither<E, A> =>
    () =>
      pipe (mma, fromIoEither, ma =>
        E.isLeft (ma)
          ? ma
          : pipe (
              E.Do,
              E.apS ("a", ma as E.Either<E, A>),
              E.tapIo (({ a }) => f (a)),
              E.map (({ a }) => a),
            ),
      ),
  tapIo:
    <E, A, B>(mma: IOEither<E, A>, f: (a: A) => IO.IO<B>): IOEither<E, A> =>
    () =>
      pipe (mma, fromIoEither, ma =>
        E.isLeft (ma)
          ? ma
          : pipe (
              E.Do,
              E.apS ("a", ma as E.Either<E, A>),
              E.tapIo (({ a }) => f (a)),
              E.map (({ a }) => a),
            ),
      ),
  applyTo: (fa, name, ff) =>
    pipe (
      Do,
      apS ("a", fa),
      apS ("f", ff),
      map (({ a, f }) => ({ [name]: f (a), ...a }) as any),
    ),
  applyResultTo: (fa, name, fb) =>
    pipe (
      Do,
      bindTo ("a", () => fa),
      bindTo ("b", () => fb),
      map (({ a, b }) => ({ [name]: b, ...a }) as any),
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

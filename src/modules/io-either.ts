/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "./either"
import * as IO from "./io"
import { createApplicative2, Applicative2 } from "../types/Applicative"
import { createFunctor2, Functor2 } from "../types/Functor"
import { createBifunctor, Bifunctor } from "../types/Bifunctor"
import { createMonad2, Monad2 } from "../types/Monad"
import { pipe } from "../utils/pipe"
import { tryDo } from "../utils/exceptions"
import { overloadWithPointFree2 } from "src/utils/points"

declare module "../types/Kind" {
  interface Kind2<E, A> {
    readonly IOEither: IOEither<E, A>
  }
}

export interface IOEither<E, A> {
  (): E.Either<E, A>
}

type IOLeftConstructor = <E, _>(e: E) => IOEither<E, _>
export const ioLeft: IOLeftConstructor = e => () => E.left (e)

type IORightConstructor = <_, A>(a: A) => IOEither<_, A>
export const ioRight: IORightConstructor = a => () => E.right (a)

type ToIOEither = <E, A>(ma: IO.IO<A>) => IOEither<E, A>
export const toTaskEither: ToIOEither = ma => () => tryDo (ma)

type FromIOEither = <E, A>(ma: IOEither<E, A>) => E.Either<E, A>
export const fromIoEither: FromIOEither = <E, A>(ma: IOEither<E, A>) => {
  try {
    return ma ()
  } catch (exception) {
    return E.left (exception)
  }
}

interface IOEitherEliminatorPointed {
  <E, A, B>(
    mma: IOEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): IO.IO<B>
}

interface IOEitherEliminator extends IOEitherEliminatorPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: IOEither<E, A>) => IO.IO<B>
}

const ioEitherPointed: IOEitherEliminatorPointed = (mma, f, g) =>
  pipe (mma, fromIoEither, E.either (f, g), IO.pure)

export const ioEither: IOEitherEliminator =
  overloadWithPointFree2 (ioEitherPointed)

export const functor: Functor2<"IOEither"> = createFunctor2 ({
  _URI: "IOEither",
  pure: ioRight,
  map:
    <_, A, B>(fma: IOEither<_, A>, f: (a: A) => B): IOEither<_, B> =>
    () =>
      pipe (fma, fromIoEither, E.map (f)),
})

export const { pure, map } = functor

export const bifunctor: Bifunctor<"IOEither"> = createBifunctor ({
  _URI: "IOEither",
  mapLeft:
    <E, _, B>(fma: IOEither<E, _>, f: (e: E) => B): IOEither<B, _> =>
    () =>
      pipe (fma, fromIoEither, E.mapLeft (f)),
  bimap:
    <E, A, B = E, C = A>(
      fma: IOEither<E, A>,
      f: (e: E) => B,
      g: (a: A) => C,
    ): IOEither<B, C> =>
    () =>
      pipe (fma, fromIoEither, E.bimap (f, g)),
})

export const { mapLeft, bimap } = bifunctor

export const applicative: Applicative2<"IOEither"> = createApplicative2 ({
  _URI: "IOEither",
  apply:
    <_, A, B>(
      fma: IOEither<_, A>,
      fmf: IOEither<_, (a: A) => B>,
    ): IOEither<_, B> =>
    () =>
      pipe (
        E.Do,
        E.apS ("a", fromIoEither (fma)),
        E.apS ("f", fromIoEither (fmf)),
        E.map (({ a, f }) => f (a)),
      ),
})

export const { apply } = applicative

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

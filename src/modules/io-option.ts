/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "./either"
import * as O from "./option"
import * as IO from "./io"
import { createApplicative, Applicative } from "../types/Applicative"
import { createFunctor, Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"
import { pipe } from "../utils/pipe"
import { tryDo } from "../utils/exceptions"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly IOOption: IOOption<A>
  }
}

export interface IOOption<A> {
  (): O.Option<A>
}

type IONoneConstructor = IOOption<never>
export const ioNone: IONoneConstructor = () => O.none

type IOSomeConstructor = <A>(a: A) => IOOption<A>
export const ioSome: IOSomeConstructor = a => () => O.some (a)

type ToIOOption = <A>(ma: IO.IO<A>) => IOOption<A>
export const toTaskEither: ToIOOption = ma => () =>
  E.either (tryDo (ma), () => O.none, O.some)

type FromIOOption = <A>(ma: IOOption<A>) => O.Option<A>
export const fromIoOption: FromIOOption = <A>(ma: IOOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}

export const functor: Functor<"IOOption"> = createFunctor ({
  _URI: "IOOption",
  pure: ioSome,
  map:
    <A, B>(fma: IOOption<A>, f: (a: A) => B): IOOption<B> =>
    () =>
      pipe (fma, fromIoOption, O.map (f)),
})

export const { pure, map } = functor

export const applicative: Applicative<"IOOption"> = createApplicative ({
  _URI: "IOOption",
  apply:
    <A, B>(fma: IOOption<A>, fmf: IOOption<(a: A) => B>): IOOption<B> =>
    () =>
      pipe (
        O.Do,
        O.apS ("a", fromIoOption (fma)),
        O.apS ("f", fromIoOption (fmf)),
        O.map (({ a, f }) => f (a)),
      ),
})

export const { apply } = applicative

export const monad: Monad<"IOOption"> = createMonad (functor) ({
  _URI: "IOOption",
  flat: mma => () =>
    pipe (mma, fromIoOption, ma =>
      O.isNone (ma) ? ma : fromIoOption (O.fromSome (ma)),
    ),
  bind: (mma, f) =>
    pipe (mma, fromIoOption, ma =>
      O.isNone (ma) ? () => ma : f (O.fromSome (ma)),
    ),
  tap:
    <A, B>(mma: IOOption<A>, f: (a: A) => IOOption<B>): IOOption<A> =>
    () =>
      pipe (mma, fromIoOption, ma =>
        O.isNone (ma)
          ? ma
          : pipe (
              O.Do,
              O.apS ("a", ma),
              O.tapIo (({ a }) => f (a)),
              O.map (({ a }) => a),
            ),
      ),
  tapIo:
    <A, B>(mma: IOOption<A>, f: (a: A) => IO.IO<B>): IOOption<A> =>
    () =>
      pipe (mma, fromIoOption, ma =>
        O.isNone (ma)
          ? ma
          : pipe (
              O.Do,
              O.apS ("a", ma),
              O.tapIo (({ a }) => f (a)),
              O.map (({ a }) => a),
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApplicative, Applicative } from "../types/Applicative"
import { createFunctor, Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"
import { pipe } from "../utils/pipe"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly IO: IO<A>
  }
}

export interface IO<A> {
  (): A
}

type IOConstructor = <A>(a: A) => IO<A>
export const io: IOConstructor = a => () => a

type FromIO = <A>(ma: IO<A>) => A
export const fromIo: FromIO = ma => ma ()

export const functor: Functor<"IO"> = createFunctor ({
  _URI: "IO",
  pure: io,
  map:
    <A, B>(fa: IO<A>, f: (a: A) => B) =>
    () =>
      pipe (fa, fromIo, f),
})

export const { pure, map } = functor

export const applicative: Applicative<"IO"> = createApplicative ({
  _URI: "IO",
  apply: (fa, ff) => map (fa, fromIo (ff)),
})

export const { apply } = applicative

export const monad: Monad<"IO"> = createMonad (functor) ({
  _URI: "IO",
  flat: fromIo,
  bind: (ma, f) => () => pipe (ma, fromIo, f, fromIo),
  tap: (ma, f) => pipe (ma, fromIo, f, fromIo, () => ma),
  tapIo: (ma, f) => pipe (ma, fromIo, f, fromIo, () => ma),
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

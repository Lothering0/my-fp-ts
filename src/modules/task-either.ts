import { Functor2 } from "../types/Functor"
import { Applicative2 } from "../types/Applicative"
import { createMonad2, Monad2 } from "../types/Monad"
import { Bifunctor } from "../types/Bifunctor"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import * as T from "./task"
import * as E from "./either"
import * as I from "./identity"
import { pipe } from "../utils/pipe"
import { _ } from "../utils/underscore"

declare module "../types/Kind" {
  interface Kind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {
  (): Promise<E.Either<E, A>>
}

type TaskLeftConstructor = <E, A>(a: E) => TaskEither<E, A>
export const taskLeft: TaskLeftConstructor = a => () =>
  Promise.resolve (E.left (a))

type TaskRightConstructor = <E, A>(a: A) => TaskEither<E, A>
export const taskRight: TaskRightConstructor = a => () =>
  Promise.resolve (E.right (a))

type ToTaskEither = <E, A>(ma: T.Task<A>) => TaskEither<E, A>
export const toTaskEither: ToTaskEither = ma => () =>
  ma ().then (
    a => E.right (a),
    e => E.left (e),
  )

type FromTaskEither = <E, A>(ma: TaskEither<E, A>) => Promise<E.Either<E, A>>
export const fromTaskEither: FromTaskEither = mma =>
  mma ().then (I.identity, e => E.left (e))

export const functor: Functor2<"TaskEither"> = {
  _URI: "TaskEither",
  pure: taskRight,
  map: (fma, f) => () => fromTaskEither (fma).then (ma => E.map (ma, f)),
}

export const { map, pure } = functor

export const bifunctor: Bifunctor<"TaskEither"> = {
  _URI: "TaskEither",
  mapLeft: (fma, f) => () => fromTaskEither (fma).then (ma => E.mapLeft (ma, f)),
  bimap:
    <E, A, B = E, C = A>(
      fma: TaskEither<E, A>,
      f: (e: E) => B,
      g: (a: A) => C,
    ): TaskEither<B, C> =>
    () =>
      fromTaskEither (fma).then (ma =>
        E.isLeft (ma) ? E.mapLeft<E, C, B> (ma, f) : E.map<B, A, C> (ma, g),
      ),
}

export const { mapLeft, bimap } = bifunctor

export const applicative: Applicative2<"TaskEither"> = {
  _URI: "TaskEither",
  apply: (fma, fmf) => () =>
    fromTaskEither (fma).then (ma =>
      fromTaskEither (fmf).then (mf =>
        pipe (
          E.Do,
          E.apS ("a", ma),
          E.apS ("f", mf),
          E.returnM (({ f, a }) => f (a)),
        ),
      ),
    ),
}

export const { apply } = applicative

export const monad: Monad2<"TaskEither"> = createMonad2 (functor) ({
  _URI: "TaskEither",
  join: mma => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma) ? ma : fromTaskEither (E.fromRight (ma)),
    ),
  bind: (mma, f) => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma) ? ma : pipe (ma, E.fromRight, f, fromTaskEither),
    ),
  tap: f => mma => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma)
        ? ma
        : pipe (ma, E.fromRight, f, fromTaskEither).then (() => ma),
    ),
  tapIo: f => mma => () =>
    fromTaskEither (mma).then (
      ma => (E.isLeft (ma) ? ma : f (E.fromRight (ma)), ma),
    ),
  applyTo: (name, fmf) => fma => () =>
    fromTaskEither (fmf).then (mf =>
      fromTaskEither (fma).then (ma =>
        pipe (
          E.Do,
          E.apS ("f", mf),
          E.apS ("a", ma),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          E.returnM (({ f, a }) => ({ [name]: f (a), ...a }) as any),
        ),
      ),
    ),
  applyResultTo: (name, fmb) => fma => () =>
    Promise.all ([fromTaskEither (fma), fromTaskEither (fmb)]).then (([ma, mb]) =>
      pipe (
        E.Do,
        E.apS ("a", ma),
        E.apS ("b", mb),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        E.returnM (({ a, b }) => ({ [name]: b, ...a }) as any),
      ),
    ),
})

export const {
  Do,
  join,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
  returnM,
} = monad

type TapTask = <E, A, _>(
  f: (a: A) => T.Task<_>,
) => (ma: TaskEither<E, A>) => TaskEither<E, A>
export const tapTask: TapTask = f => mma => () =>
  fromTaskEither (mma).then (ma =>
    E.isLeft (ma) ? ma : pipe (ma, E.fromRight, f, T.fromTask).then (() => ma),
  )

export const parallel = applyResultTo

type GetRaceSemigroup = <E, A>() => Semigroup<TaskEither<E, A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => () => Promise.race ([fromTaskEither (x), fromTaskEither (y)]),
})

type GetRaceMonoid = <E, A>() => Monoid<TaskEither<E, A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => E.right (_)),
})

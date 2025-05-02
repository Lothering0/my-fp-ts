/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFunctor2, Functor2 } from "../types/Functor"
import { createApplicative2, Applicative2 } from "../types/Applicative"
import { createMonad2, Monad2 } from "../types/Monad"
import { createBifunctor, Bifunctor } from "../types/Bifunctor"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import * as T from "./task"
import * as E from "./either"
import * as I from "./identity"
import { pipe } from "../utils/pipe"
import { _ } from "../utils/underscore"
import { overloadWithPointFree2 } from "../utils/points"

declare module "../types/Kind" {
  interface Kind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {
  (): Promise<E.Either<E, A>>
}

type TaskLeftConstructor = <E, _>(e: E) => TaskEither<E, _>
export const taskLeft: TaskLeftConstructor = a => () =>
  Promise.resolve (E.left (a))

type TaskRightConstructor = <_, A>(a: A) => TaskEither<_, A>
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

interface TaskEitherEliminatorPointed {
  <E, A, B>(
    mma: TaskEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): T.Task<B>
}

interface TaskEitherEliminator extends TaskEitherEliminatorPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: TaskEither<E, A>) => T.Task<B>
}

const taskEitherPointed: TaskEitherEliminatorPointed = (mma, f, g) => () =>
  fromTaskEither (mma).then (E.either (f, g))

export const taskEither: TaskEitherEliminator =
  overloadWithPointFree2 (taskEitherPointed)

export const functor: Functor2<"TaskEither"> = createFunctor2 ({
  _URI: "TaskEither",
  pure: taskRight,
  map:
    <_, A, B>(fma: TaskEither<_, A>, f: (a: A) => B): TaskEither<_, B> =>
    () =>
      fromTaskEither (fma).then (ma => E.map (ma, f)),
})

export const { map, pure } = functor

export const bifunctor: Bifunctor<"TaskEither"> = createBifunctor ({
  _URI: "TaskEither",
  mapLeft:
    <E, _, B>(fma: TaskEither<E, _>, f: (e: E) => B): TaskEither<B, _> =>
    () =>
      fromTaskEither (fma).then (ma => E.mapLeft (ma, f)),
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
})

export const { mapLeft, bimap } = bifunctor

export const applicative: Applicative2<"TaskEither"> = createApplicative2 ({
  _URI: "TaskEither",
  apply:
    <_, A, B>(
      fma: TaskEither<_, A>,
      fmf: TaskEither<_, (a: A) => B>,
    ): TaskEither<_, B> =>
    () =>
      fromTaskEither (fma).then (ma =>
        fromTaskEither (fmf).then (mf =>
          pipe (
            E.Do,
            E.apS ("a", ma),
            E.apS ("f", mf),
            E.map (({ f, a }) => f (a)),
          ),
        ),
      ),
})

export const { apply } = applicative

export const monad: Monad2<"TaskEither"> = createMonad2 (functor) ({
  _URI: "TaskEither",
  flat: mma => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma) ? ma : fromTaskEither (E.fromRight (ma)),
    ),
  bind: (mma, f) => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma) ? ma : pipe (ma, E.fromRight, f, fromTaskEither),
    ),
  tap: (mma, f) => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma)
        ? ma
        : pipe (ma, E.fromRight, f, fromTaskEither).then (ea =>
            E.isLeft (ea) ? ea : ma,
          ),
    ),
  tapIo: (mma, f) => () =>
    fromTaskEither (mma).then (
      ma => (E.isLeft (ma) ? ma : f (E.fromRight (ma)), ma),
    ),
  applyTo: (fma, name, fmf) => () =>
    fromTaskEither (fmf).then (mf =>
      fromTaskEither (fma).then (ma =>
        pipe (
          E.Do,
          E.apS ("f", mf),
          E.apS ("a", ma),
          E.map (({ f, a }) => ({ [name]: f (a), ...a }) as any),
        ),
      ),
    ),
  applyResultTo: (fma, name, fmb) => () =>
    Promise.all ([fromTaskEither (fma), fromTaskEither (fmb)]).then (([ma, mb]) =>
      pipe (
        E.Do,
        E.apS ("a", ma),
        E.apS ("b", mb),
        E.map (({ a, b }) => ({ [name]: b, ...a }) as any),
      ),
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

interface TapTaskPointed {
  <_, A, _2>(ma: TaskEither<_, A>, f: (a: A) => T.Task<_2>): TaskEither<_, A>
}

interface TapTask extends TapTaskPointed {
  <_, A, _2>(
    f: (a: A) => T.Task<_2>,
  ): (ma: TaskEither<_, A>) => TaskEither<_, A>
}

const tapTaskPointed: TapTaskPointed = (mma, f) => () =>
  fromTaskEither (mma).then (ma =>
    E.isLeft (ma) ? ma : pipe (ma, E.fromRight, f, T.fromTask).then (() => ma),
  )

export const tapTask: TapTask = (a: any, b?: any): any =>
  typeof b === "undefined"
    ? (mma: any) => tapTaskPointed (mma, a)
    : tapTaskPointed (a, b)

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

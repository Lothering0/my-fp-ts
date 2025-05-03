/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFunctor, Functor } from "../types/Functor"
import { createApplicative, Applicative } from "../types/Applicative"
import { createMonad, Monad } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import * as T from "./task"
import * as TE from "./task-either"
import * as E from "./either"
import * as O from "./option"
import * as I from "./identity"
import { pipe } from "../utils/pipe"
import { _ } from "../utils/underscore"
import { overloadWithPointFree, overloadWithPointFree2 } from "../utils/points"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly TaskOption: TaskOption<A>
  }
}

export interface TaskOption<A> extends T.Task<O.Option<A>> {
  (): Promise<O.Option<A>>
}

type TaskNoneConstructor = TaskOption<never>
export const taskNone: TaskNoneConstructor = () => Promise.resolve (O.none)

type TaskSomeConstructor = <A>(a: A) => TaskOption<A>
export const taskSome: TaskSomeConstructor = a => () =>
  Promise.resolve (O.some (a))

type ToTaskOptionFromTask = <A>(ma: T.Task<A>) => TaskOption<A>
export const toTaskOptionFromTask: ToTaskOptionFromTask = ma => () =>
  ma ().then (O.some, () => O.none)

type ToTaskOptionFromTaskEither = <E, A>(
  ma: TE.TaskEither<E, A>,
) => TaskOption<A>
export const toTaskOptionFromTaskEither: ToTaskOptionFromTaskEither =
  ma => () =>
    ma ().then (
      ma => E.either (ma, () => O.none, O.some),
      () => O.none,
    )

type FromTaskOption = <A>(ma: TaskOption<A>) => Promise<O.Option<A>>
export const fromTaskOption: FromTaskOption = mma =>
  mma ().then (I.identity, () => O.none)

interface TaskOptionEliminatorPointed {
  <A, B>(
    mma: TaskOption<A>,
    whenNone: () => B,
    whenSome: (a: A) => B,
  ): T.Task<B>
}

interface TaskOptionEliminator extends TaskOptionEliminatorPointed {
  <A, B>(
    whenNone: () => B,
    whenSome: (a: A) => B,
  ): (mma: TaskOption<A>) => T.Task<B>
}

const taskOptionPointed: TaskOptionEliminatorPointed = (mma, f, g) => () =>
  fromTaskOption (mma).then (O.option (f, g))

export const taskOption: TaskOptionEliminator =
  overloadWithPointFree2 (taskOptionPointed)

export const functor: Functor<"TaskOption"> = createFunctor ({
  _URI: "TaskOption",
  pure: taskSome,
  map:
    <A, B>(fma: TaskOption<A>, f: (a: A) => B): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (ma => O.map (ma, f)),
})

export const { map, pure } = functor

export const applicative: Applicative<"TaskOption"> = createApplicative ({
  _URI: "TaskOption",
  apply:
    <A, B>(fma: TaskOption<A>, fmf: TaskOption<(a: A) => B>): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (ma =>
        fromTaskOption (fmf).then (mf =>
          pipe (
            O.Do,
            O.apS ("a", ma),
            O.apS ("f", mf),
            O.map (({ f, a }) => f (a)),
          ),
        ),
      ),
})

export const { apply } = applicative

export const monad: Monad<"TaskOption"> = createMonad (functor) ({
  _URI: "TaskOption",
  flat: mma => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma) ? ma : fromTaskOption (O.fromSome (ma)),
    ),
  bind: (mma, f) => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, f, fromTaskOption),
    ),
  tap: (mma, f) => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma)
        ? ma
        : pipe (ma, O.fromSome, f, fromTaskOption).then (oa =>
            O.isNone (oa) ? O.none : ma,
          ),
    ),
  tapIo: (mma, f) => () =>
    fromTaskOption (mma).then (ma => (O.isNone (ma) ? ma : f (O.fromSome (ma)), ma)),
  applyTo: (fma, name, fmf) => () =>
    fromTaskOption (fmf).then (mf =>
      fromTaskOption (fma).then (ma =>
        pipe (
          O.Do,
          O.apS ("f", mf),
          O.apS ("a", ma),
          O.map (({ f, a }) => ({ [name]: f (a), ...a }) as any),
        ),
      ),
    ),
  applyResultTo: (fma, name, fmb) => () =>
    Promise.all ([fromTaskOption (fma), fromTaskOption (fmb)]).then (([ma, mb]) =>
      pipe (
        O.Do,
        O.apS ("a", ma),
        O.apS ("b", mb),
        O.map (({ a, b }) => ({ [name]: b, ...a }) as any),
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
  <A, _>(ma: TaskOption<A>, f: (a: A) => T.Task<_>): TaskOption<A>
}

interface TapTask extends TapTaskPointed {
  <A, _>(f: (a: A) => T.Task<_>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapTaskPointed: TapTaskPointed = (mma, f) => () =>
  fromTaskOption (mma).then (ma =>
    O.isNone (ma) ? ma : pipe (ma, O.fromSome, f, T.fromTask).then (() => ma),
  )

export const tapTask: TapTask = overloadWithPointFree (tapTaskPointed)

interface TapTaskEitherPointed {
  <E, A, _>(ma: TaskOption<A>, f: (a: A) => TE.TaskEither<E, _>): TaskOption<A>
}

interface TapTaskEither extends TapTaskEitherPointed {
  <E, A, _>(
    f: (a: A) => TE.TaskEither<E, _>,
  ): (ma: TaskOption<A>) => TaskOption<A>
}

const tapTaskEitherPointed: TapTaskEitherPointed = (mma, f) => () =>
  fromTaskOption (mma).then (ma =>
    O.isNone (ma)
      ? ma
      : pipe (ma, O.fromSome, f, T.fromTask).then (ea =>
          E.isLeft (ea) ? O.none : ma,
        ),
  )

export const tapTaskEither: TapTaskEither =
  overloadWithPointFree (tapTaskEitherPointed)

export const parallel = applyResultTo

type GetRaceSemigroup = <A>() => Semigroup<TaskOption<A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => () => Promise.race ([fromTaskOption (x), fromTaskOption (y)]),
})

type GetRaceMonoid = <A>() => Monoid<TaskOption<A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => O.some (_)),
})

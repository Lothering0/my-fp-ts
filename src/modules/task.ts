import * as I from "./identity"
import { createFunctor, Functor } from "../types/Functor"
import { createApplicative, Applicative } from "../types/Applicative"
import { createMonad, Monad } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { _ } from "../utils/underscore"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly Task: Task<A>
  }
}

export interface Task<A> {
  (): Promise<A>
}

type TaskConstructor = <A>(a: A) => Task<A>
export const task: TaskConstructor = a => () => Promise.resolve (a)

type FromTask = <A>(ma: Task<A>) => Promise<A>
export const fromTask: FromTask = ma => ma ()

export const functor: Functor<"Task"> = createFunctor ({
  _URI: "Task",
  pure: task,
  map:
    <A, B>(fa: Task<A>, f: (a: A) => B): Task<B> =>
    () =>
      fromTask (fa).then (f),
})

export const { map, pure } = functor

export const applicative: Applicative<"Task"> = createApplicative ({
  _URI: "Task",
  apply:
    <A, B>(fa: Task<A>, ff: Task<(a: A) => B>): Task<B> =>
    () =>
      fromTask (fa).then (a => fromTask (ff).then (f => f (a))),
})

export const { apply } = applicative

export const monad: Monad<"Task"> = createMonad (functor) ({
  _URI: "Task",
  flat: mma => () => fromTask (mma).then (fromTask),
  bind: (ma, f) => () => fromTask (ma).then (I.compose (fromTask, f)),
  tap: (ma, f) => () => fromTask (ma).then (a => fromTask (f (a)).then (() => a)),
  tapIo: (ma, f) => () => fromTask (ma).then (a => (f (a), a)),
  applyTo: (fa, name, ff) => () =>
    fromTask (ff).then (f =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromTask (fa).then (a => ({ [name]: f (a), ...a }) as any),
    ),
  applyResultTo: (fa, name, fb) => () =>
    Promise.all ([fromTask (fa), fromTask (fb)]).then (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([a, b]) => ({ [name]: b, ...a }) as any,
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

export const parallel = applyResultTo

type GetRaceSemigroup = <A>() => Semigroup<Task<A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => () => Promise.race ([fromTask (x), fromTask (y)]),
})

type GetRaceMonoid = <A>() => Monoid<Task<A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => _),
})

import {
  Applicative,
  createMonad,
  Functor,
  Monad,
  Monoid,
  Semigroup,
} from "../../types"
import { _, compose } from "../../utils"

declare module "../../types" {
  interface Kind<A> {
    readonly Task: Task<A>
  }
}

export interface Task<A> {
  (): Promise<A>
}

type TaskConstructor = <A>(a: A) => Task<A>
export const task: TaskConstructor = a => () => Promise.resolve (a)

type ToTask = <A>(pa: Promise<A>) => Task<A>
export const toTask: ToTask = pa => () => pa

type FromTask = <A>(ma: Task<A>) => Promise<A>
export const fromTask: FromTask = ma => ma ()

export const functor: Functor<"Task"> = {
  _URI: "Task",
  pure: task,
  map: (fa, f) => toTask (fromTask (fa).then (f)),
}

export const { map, pure } = functor

export const applicative: Applicative<"Task"> = {
  _URI: "Task",
  apply: (fa, ff) =>
    toTask (fromTask (fa).then (a => fromTask (ff).then (f => f (a)))),
}

export const { apply } = applicative

export const monad: Monad<"Task"> = createMonad (functor) ({
  _URI: "Task",
  join: mma => toTask (fromTask (mma).then (fromTask)),
  bind: (ma, f) => toTask (fromTask (ma).then (compose (fromTask, f))),
  tap: f => ma => toTask (fromTask (ma).then (a => fromTask (f (a)).then (() => a))),
  tapIo: f => ma => toTask (fromTask (ma).then (a => (f (a), a))),
})

export const { Do, join, bind, mapTo, applyTo, bindTo, tap, tapIo } = monad

type GetRaceSemigroup = <A>() => Semigroup<Task<A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => toTask (Promise.race ([fromTask (x), fromTask (y)])),
})

type GetRaceMonoid = <A>() => Monoid<Task<A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: toTask (new Promise (() => _)),
})

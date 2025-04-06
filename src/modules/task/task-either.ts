import { Applicative, createMonad, Functor2, Monad } from "../../types"
import { compose } from "../../utils"
import { Either, left, right } from "../either"
import { Task } from "./task"

declare module "../../types" {
  interface Kind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends Task<Either<E, A>> {
  (): Promise<Either<E, A>>
}

type TaskLeftConstructor = <E, A>(a: A) => TaskEither<E, A>
export const taskLeft: TaskLeftConstructor = a => () => Promise.resolve (left (a))

type TaskRightConstructor = <E, A>(a: A) => TaskEither<E, A>
export const taskRight: TaskRightConstructor = a => () =>
  Promise.resolve (right (a))

type ToTask = <A>(pa: Promise<A>) => Task<A>
export const toTask: ToTask = pa => () => pa

type FromTask = <A>(ma: Task<A>) => Promise<A>
export const fromTask: FromTask = ma => ma ()

export const functor: Functor2<"TaskEither"> = {
  _URI: "TaskEither",
  pure: taskRight,
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

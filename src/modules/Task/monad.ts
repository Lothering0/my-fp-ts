/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "./task"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { DoObject } from "../../types/DoObject"
import { overload } from "../../utils/overloads"

export const monad: Monad<T.TaskHKT> = createMonad ({
  ...applicative,
  flat:
    <A>(mma: T.Task<T.Task<A>>): T.Task<A> =>
    () =>
      T.fromTask (mma).then (T.fromTask),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad

export const parallel: {
  <N extends string | number | symbol, A, B>(
    fb: T.Task<B>,
  ): (fa: T.Task<A>) => T.Task<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: T.Task<A>,
    fb: T.Task<B>,
  ): T.Task<DoObject<N, A, B>>
} = overload (
  1,
  (fa, fb) => () =>
    Promise.all ([T.fromTask (fa), T.fromTask (fb)]).then (([a]) => a as any),
)

export const parallelTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: T.Task<B>,
  ): (fa: T.Task<A>) => T.Task<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: T.Task<A>,
    name: Exclude<N, keyof A>,
    fb: T.Task<B>,
  ): T.Task<DoObject<N, A, B>>
} = overload (
  2,
  <N extends string | number | symbol, A, B>(
    fa: T.Task<A>,
    name: Exclude<N, keyof A>,
    fb: T.Task<B>,
  ): T.Task<DoObject<N, A, B>> =>
    () =>
      Promise.all ([T.fromTask (fa), T.fromTask (fb)]).then (
        ([a, b]) => ({ [name]: b, ...a }) as any,
      ),
)

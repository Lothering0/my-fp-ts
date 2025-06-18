/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "./task"
import { createMonad, Monad, DoObject } from "../../types/Monad"
import { applicative } from "./applicative"
import { overload, overload2 } from "../../utils/overloads"

export const monad: Monad<T.URI> = createMonad ({
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

interface ParallelPointed {
  <N extends string | number | symbol, A, B>(
    fa: T.Task<A>,
    fb: T.Task<B>,
  ): T.Task<DoObject<N, A, B>>
}

interface Parallel extends ParallelPointed {
  <N extends string | number | symbol, A, B>(
    fb: T.Task<B>,
  ): (fa: T.Task<A>) => T.Task<DoObject<N, A, B>>
}

const parallelPointed: ParallelPointed = (fa, fb) => () =>
  Promise.all ([T.fromTask (fa), T.fromTask (fb)]).then (([a]) => a as any)

export const parallel: Parallel = overload (parallelPointed)

interface ParallelToPointed {
  <N extends string | number | symbol, A, B>(
    fa: T.Task<A>,
    name: Exclude<N, keyof A>,
    fb: T.Task<B>,
  ): T.Task<DoObject<N, A, B>>
}

interface ParallelTo extends ParallelToPointed {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: T.Task<B>,
  ): (fa: T.Task<A>) => T.Task<DoObject<N, A, B>>
}

const parallelToPointed: ParallelToPointed = (fa, name, fb) => () =>
  Promise.all ([T.fromTask (fa), T.fromTask (fb)]).then (
    ([a, b]) => ({ [name]: b, ...a }) as any,
  )

export const parallelTo: ParallelTo = overload2 (parallelToPointed)

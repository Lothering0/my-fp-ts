/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "./task"
import { createMonad, Monad, DoObject } from "../../types/Monad"
import { functor } from "./functor"
import {
  overloadWithPointFree,
  overloadWithPointFree2,
} from "../../utils/points"

export const monad: Monad<"Task"> = createMonad (functor) ({
  _URI: "Task",
  flat: mma => () => T.fromTask (mma).then (T.fromTask),
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

export const parallel: Parallel = overloadWithPointFree (parallelPointed)

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

export const parallelTo: ParallelTo = overloadWithPointFree2 (parallelToPointed)

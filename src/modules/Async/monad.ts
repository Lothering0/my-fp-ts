/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "./async"
import { createMonad } from "../../types/Monad"
import { applicative } from "./applicative"
import { DoObject } from "../../types/DoObject"
import { overload } from "../../utils/overloads"

export const monad = createMonad<A.AsyncHKT> ({
  ...applicative,
  flat: self => () => A.fromAsync (self).then (A.fromAsync),
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
  tapSync,
} = monad

export const parallel: {
  <N extends string | number | symbol, A, B>(
    fb: A.Async<B>,
  ): (fa: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: A.Async<A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>>
} = overload (
  1,
  (fa, fb) => () =>
    Promise.all ([A.fromAsync (fa), A.fromAsync (fb)]).then (([a]) => a as any),
)

export const parallelTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): (fa: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: A.Async<A>,
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>>
} = overload (
  2,
  <N extends string | number | symbol, A, B>(
    fa: A.Async<A>,
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>> =>
    () =>
      Promise.all ([A.fromAsync (fa), A.fromAsync (fb)]).then (
        ([a, b]) => ({ [name]: b, ...a }) as any,
      ),
)

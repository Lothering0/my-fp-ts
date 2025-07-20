/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "./async"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { DoObject } from "../../types/DoObject"
import { overload } from "../../utils/overloads"

export const Monad = createMonad<A.AsyncHKT> ({
  ...Applicative,
  flat: self => () => A.toPromise (self).then (A.toPromise),
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
} = Monad

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
    Promise.all ([A.toPromise (fa), A.toPromise (fb)]).then (([a]) => a as any),
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
      Promise.all ([A.toPromise (fa), A.toPromise (fb)]).then (
        ([a, b]) => ({ [name]: b, ...a }) as any,
      ),
)

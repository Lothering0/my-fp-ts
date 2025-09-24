/* eslint-disable @typescript-eslint/no-explicit-any */
import * as async from "./async"
import { create } from "../../typeclasses/Monad"
import { Applicative } from "./applicative"
import { DoObject, DoObjectKey } from "../../types/DoObject"

export const Monad = create<async.AsyncHkt> (Applicative, {
  flat: self => () => async.toPromise (self).then (async.toPromise),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: async.Async<async.Async<A>>): async.Async<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => async.Async<B>,
  ): (self: async.Async<A>) => async.Async<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => async.Async<C>,
    amb: (a: A) => async.Async<B>,
  ): (a: A) => async.Async<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: async.Async<(a: A) => B>,
  ): (self: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: async.Async<B>,
  ): (self: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => async.Async<B>,
  ): (self: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, A, B>(
    fb: async.Async<B>,
  ): (fa: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = fb => fa => () =>
  Promise.all ([async.toPromise (fa), async.toPromise (fb)]).then (
    ([a]) => a as any,
  )

export const parallelTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: async.Async<B>,
  ): (fa: async.Async<A>) => async.Async<DoObject<N, A, B>>
} = (name, fb) => fa => () =>
  Promise.all ([async.toPromise (fa), async.toPromise (fb)]).then (
    ([a, b]) => ({ [name]: b, ...a }) as any,
  )

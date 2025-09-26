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
  <In>(self: async.Async<async.Async<In>>): async.Async<In>
} = Monad.flat

export const flatMap: {
  <In, Out>(
    amb: (a: In) => async.Async<Out>,
  ): (self: async.Async<In>) => async.Async<Out>
} = Monad.flatMap

export const compose: {
  <In, Out1, Out2>(
    bmc: (b: Out1) => async.Async<Out2>,
    amb: (a: In) => async.Async<Out1>,
  ): (a: In) => async.Async<Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ): (self: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In) => Out,
  ): (self: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fab: async.Async<(a: In) => Out>,
  ): (self: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fb: async.Async<Out>,
  ): (self: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    amb: (a: In) => async.Async<Out>,
  ): (self: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, In, Out>(
    fb: async.Async<Out>,
  ): (fa: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = fb => fa => () =>
  Promise.all ([async.toPromise (fa), async.toPromise (fb)]).then (
    ([a]) => a as any,
  )

export const parallelTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fb: async.Async<Out>,
  ): (fa: async.Async<In>) => async.Async<DoObject<N, In, Out>>
} = (name, fb) => fa => () =>
  Promise.all ([async.toPromise (fa), async.toPromise (fb)]).then (
    ([a, b]) => ({ [name]: b, ...a }) as any,
  )

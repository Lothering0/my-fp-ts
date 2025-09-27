/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Async from './async'
import { create } from '../../typeclasses/Monad'
import { Applicative } from './applicative'
import { DoObject, DoObjectKey } from '../../types/DoObject'

export const Monad = create<Async.AsyncHkt>(Applicative, {
  flat: self => () => Async.toPromise(self).then(Async.toPromise),
})

export const Do = Monad.Do

export const flat: {
  <In>(self: Async.Async<Async.Async<In>>): Async.Async<In>
} = Monad.flat

export const flatMap: {
  <In, Out>(
    amb: (a: In) => Async.Async<Out>,
  ): (self: Async.Async<In>) => Async.Async<Out>
} = Monad.flatMap

export const compose: {
  <In, Out1, Out2>(
    bmc: (b: Out1) => Async.Async<Out2>,
    amb: (a: In) => Async.Async<Out1>,
  ): (a: In) => Async.Async<Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ): (self: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In) => Out,
  ): (self: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fab: Async.Async<(a: In) => Out>,
  ): (self: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fb: Async.Async<Out>,
  ): (self: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    amb: (a: In) => Async.Async<Out>,
  ): (self: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, In, Out>(
    fb: Async.Async<Out>,
  ): (fa: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = fb => fa => () =>
  Promise.all([Async.toPromise(fa), Async.toPromise(fb)]).then(
    ([a]) => a as any,
  )

export const parallelTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fb: Async.Async<Out>,
  ): (fa: Async.Async<In>) => Async.Async<DoObject<N, In, Out>>
} = (name, fb) => fa => () =>
  Promise.all([Async.toPromise(fa), Async.toPromise(fb)]).then(
    ([a, b]) => ({ [name]: b, ...a }) as any,
  )

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as option from '../Option'
import { create } from '../../typeclasses/Monad'
import { AsyncOptionHkt, AsyncOption, toPromise } from './async-option'
import { Applicative } from './applicative'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'

export const Monad = create<AsyncOptionHkt>(Applicative, {
  flat: self => () =>
    toPromise(self).then(ma =>
      option.isNone(ma) ? ma : pipe(ma, option.value, toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <Out>(self: AsyncOption<AsyncOption<Out>>): AsyncOption<Out>
} = Monad.flat

export const flatMap: {
  <In, Out>(
    amb: (a: In) => AsyncOption<Out>,
  ): (self: AsyncOption<In>) => AsyncOption<Out>
} = Monad.flatMap

export const compose: {
  <In, Out1, Out2>(
    bmc: (b: Out1) => AsyncOption<Out2>,
    amb: (a: In) => AsyncOption<Out1>,
  ): (a: In) => AsyncOption<Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ): (self: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In) => Out,
  ): (self: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fab: AsyncOption<(a: In) => Out>,
  ): (self: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fb: AsyncOption<Out>,
  ): (self: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    amb: (a: In) => AsyncOption<Out>,
  ): (self: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, Out>(
    fb: AsyncOption<Out>,
  ): <In>(fa: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = fb => fa => () =>
  Promise.all([toPromise(fa), toPromise(fb)]).then(([ma, mb]) =>
    pipe(
      mb,
      option.flatMap(() => ma as any),
    ),
  )

export const parallelTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    fb: AsyncOption<Out>,
  ): (fa: AsyncOption<In>) => AsyncOption<DoObject<N, In, Out>>
} = (name, fb) => fa => () =>
  Promise.all([toPromise(fa), toPromise(fb)]).then(([ma, mb]) =>
    option.apS(name, mb)(ma),
  )

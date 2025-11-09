import * as Result from '../Result'
import * as Reader from '../Reader'
import * as Functor_ from '../../typeclasses/Functor'
import { Effect, EffectHkt, EffectValue } from './effect'
import { create } from './_internal'
import { pipe } from '../../utils/flow'

export const mapResult: {
  <A, E, B, D, R>(
    f: (result: Result.Result<A, E>) => Reader.Reader<R, EffectValue<B, D>>,
  ): (self: Effect<A, E, R>) => Effect<B, D, R>
} = f => self => create(result => r => f(result)(r), self)

export const asResult: {
  <A, E, R>(
    ma: EffectValue<A, E>,
  ): (self: Effect<unknown, unknown, unknown>) => Effect<A, E, R>
} = ma => mapResult(() => () => ma)

export const Functor = Functor_.create<EffectHkt>({
  map: ab => mapResult(ma => () => pipe(ma, Result.map(ab))),
})

export const map: {
  <A, B>(
    ab: (success: A) => B,
  ): <E, R>(self: Effect<A, E, R>) => Effect<B, E, R>
} = Functor.map

export const as: {
  <A>(a: A): <E, R>(self: Effect<unknown, E, R>) => Effect<A, E, R>
} = Functor.as

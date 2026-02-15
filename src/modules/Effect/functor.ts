import * as Result from '../Result'
import * as Reader from '../Reader'
import * as Functor_ from '../../typeclasses/Functor'
import { Effect, Hkt, EffectValue } from './effect'
import { create } from './_internal'
import { pipe } from '../../utils/flow'

export const mapResult: {
  <A, E, B, D, R>(
    f: (result: Result.Result<A, E>) => Reader.Reader<R, EffectValue<B, D>>,
  ): (effect: Effect<A, E, R>) => Effect<B, D, R>
} = f => effect => create(result => r => f(result)(r), effect)

export const asResult: {
  <A, E, R>(
    result: EffectValue<A, E>,
  ): (effect: Effect<unknown, unknown, unknown>) => Effect<A, E, R>
} = result => mapResult(() => () => result)

export const Functor = Functor_.create<Hkt>({
  map: ab => mapResult(result => () => pipe(result, Result.map(ab))),
})

export const map: {
  <A, B>(
    ab: (success: A) => B,
  ): <E, R>(effect: Effect<A, E, R>) => Effect<B, E, R>
} = Functor.map

export const as: {
  <A>(a: A): <E, R>(effect: Effect<unknown, E, R>) => Effect<A, E, R>
} = Functor.as

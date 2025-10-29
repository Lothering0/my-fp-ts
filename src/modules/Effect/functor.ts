import * as Result from '../Result'
import * as Functor_ from '../../typeclasses/Functor'
import { Effect, EffectHkt, EffectValue } from './effect'
import { create } from './_internal'

export const mapResult: {
  <A, E, B, D>(
    f: (result: Result.Result<A, E>) => EffectValue<B, D>,
  ): (self: Effect<A, E>) => Effect<B, D>
} = f => self => create(f, self)

export const asResult: {
  <A, E>(
    ma: EffectValue<A, E>,
  ): (self: Effect<unknown, unknown>) => Effect<A, E>
} = ma => mapResult(() => ma)

export const Functor = Functor_.create<EffectHkt>({
  map: ab => mapResult(Result.map(ab)),
})

export const map: {
  <A, B>(ab: (success: A) => B): <E>(self: Effect<A, E>) => Effect<B, E>
} = Functor.map

export const as: {
  <A>(a: A): <E>(self: Effect<unknown, E>) => Effect<A, E>
} = Functor.as

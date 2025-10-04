import * as Result from '../Result'
import * as Functor_ from '../../typeclasses/Functor'
import { Effect, EffectHkt, toEffect } from './effect'
import { pipe } from '../../utils/flow'
import { identity } from '../Identity'

export const mapResult: {
  <A, E, B, D>(
    f: (
      result: Result.Result<A, E>,
    ) => Result.Result<B, D> | Promise<Result.Result<B, D>>,
  ): (self: Effect<A, E>) => Effect<B, D>
} = f => self =>
  toEffect(() => {
    const result = self.effect()
    if (result instanceof Promise) {
      return result.then(f)
    }
    return pipe(result, f)
  })

export const Functor: Functor_.Functor<EffectHkt> = {
  map: ab => mapResult(Result.bimap(identity, ab)),
}

export const map: {
  <A, B>(ab: (success: A) => B): <E>(self: Effect<A, E>) => Effect<B, E>
} = Functor.map

import * as Stream from './stream'
import * as Effect from '../Effect'
import { FromEffect as FromEffect_ } from '../../typeclasses/FromEffect'
import { succeed } from './utils'
import { pipe } from '../../utils/flow'

export const FromEffect: FromEffect_<Stream.Hkt> = {
  fromEffect: effect =>
    pipe(
      effect,
      Effect.flatMap(a => succeed(a)),
    ),
}

export const fromEffect: {
  <A, E = never, R = unknown>(
    effect: Effect.Effect<A, E, R>,
  ): Stream.Stream<A, E, R>
} = FromEffect.fromEffect

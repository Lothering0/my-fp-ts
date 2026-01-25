import * as Result from '../Result'
import * as MonadBoth_ from '../../typeclasses/MonadBoth'
import { Monad } from './monad'
import { Bifunctor } from './bifunctor'
import { Effect, EffectHkt, run } from './effect'
import { FromIdentityLeft } from './from-identity-left'
import { create } from './_internal'

export const MonadBoth = MonadBoth_.create<EffectHkt>(
  FromIdentityLeft,
  Bifunctor,
  Monad,
  {
    flatLeft: <A, B, E, R>(self: Effect<A, Effect<B, E, R>, R>) =>
      create<A, Effect<B, E, R>, A | B, E, R>(
        ma => r => (Result.isFailure(ma) ? run(r)(ma.failure) : ma),
        self,
      ),
  },
)

export const flatLeft: {
  <A, B, E, R>(self: Effect<A, Effect<B, E, R>, R>): Effect<A | B, E, R>
} = MonadBoth.flatLeft

export const flatMapLeft: {
  <A, E, D, R>(
    emd: (e: E) => Effect<A, D, R>,
  ): <B>(self: Effect<B, E, R>) => Effect<A | B, D, R>
} = MonadBoth.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D, R>(
    amb: (e: E1) => Effect<A, E2, R>,
    bmc: (d: E2) => Effect<A, D, R>,
  ): (e: E1) => Effect<A, D, R>
} = MonadBoth.composeLeft

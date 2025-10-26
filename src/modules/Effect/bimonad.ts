import * as Result from '../Result'
import * as Bimonad_ from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Bifunctor } from './bifunctor'
import { Effect, EffectHkt, run } from './effect'
import { FromIdentityLeft } from './from-identity-left'
import { create } from './_internal'

export const Bimonad = Bimonad_.create<EffectHkt>(
  FromIdentityLeft,
  Bifunctor,
  Monad,
  {
    flatLeft: <A, B, E>(self: Effect<A, Effect<B, E>>) =>
      create<A, Effect<B, E>, A | B, E>(
        ma => (Result.isFailure(ma) ? run(ma.failure) : ma),
        self,
      ),
  },
)

export const flatLeft: {
  <A, B, E>(self: Effect<A, Effect<B, E>>): Effect<A | B, E>
} = Bimonad.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => Effect<A, D>,
  ): <B>(self: Effect<B, E>) => Effect<A | B, D>
} = Bimonad.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    bmc: (d: E2) => Effect<A, D>,
    amb: (e: E1) => Effect<A, E2>,
  ): (e: E1) => Effect<A, D>
} = Bimonad.composeLeft

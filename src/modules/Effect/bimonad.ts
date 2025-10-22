import * as Result from '../Result'
import { create } from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Bifunctor } from './bifunctor'
import { Effect, EffectHkt, fromOperation } from './effect'
import { FromIdentityLeft } from './from-identity-left'
import { pipe } from '../../utils/flow'

export const Bimonad = create<EffectHkt>(FromIdentityLeft, Bifunctor, Monad, {
  flatLeft: self =>
    fromOperation(() => {
      const mma = self.run()

      if (mma instanceof Promise) {
        return mma.then(
          Result.match({
            onSuccess: Result.succeed,
            onFailure: ma => ma.run(),
          }),
        )
      }

      return pipe(
        mma,
        Result.match({
          onSuccess: Result.succeed,
          onFailure: ma => ma.run(),
        }),
      )
    }),
})

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

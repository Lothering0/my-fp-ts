import { create } from '../../typeclasses/Bimonad'
import { Monad } from './monad'
import { Bifunctor } from './bifunctor'
import { Result, ResultHkt, succeed } from './result'
import { FromIdentityLeft } from './from-identity-left'
import { identity } from '../Identity'
import { match } from './matchers'

export const Bimonad = create<ResultHkt>(FromIdentityLeft, Bifunctor, Monad, {
  flatLeft: match({
    onSuccess: succeed,
    onFailure: identity,
  }),
})

export const flatLeft: {
  <A, B, E>(self: Result<A, Result<B, E>>): Result<A | B, E>
} = Bimonad.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => Result<A, D>,
  ): <B>(self: Result<B, E>) => Result<A | B, D>
} = Bimonad.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    bmc: (d: E2) => Result<A, D>,
    amb: (e: E1) => Result<A, E2>,
  ): (e: E1) => Result<A, D>
} = Bimonad.composeLeft

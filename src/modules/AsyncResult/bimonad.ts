import * as Bimonad_ from '../../typeclasses/Bimonad'
import { _AsyncResult } from './_internal'
import { AsyncResult, AsyncResultHkt } from './async-result'

export const Bimonad: Bimonad_.Bimonad<AsyncResultHkt> = _AsyncResult.Bimonad

export const flatLeft: {
  <A, B, E>(self: AsyncResult<A, AsyncResult<B, E>>): AsyncResult<A | B, E>
} = Bimonad.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => AsyncResult<A, D>,
  ): <B>(self: AsyncResult<B, E>) => AsyncResult<A | B, D>
} = Bimonad.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    bmc: (d: E2) => AsyncResult<A, D>,
    amb: (e: E1) => AsyncResult<A, E2>,
  ): (e: E1) => AsyncResult<A, D>
} = Bimonad.composeLeft

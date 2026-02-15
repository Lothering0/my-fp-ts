import * as Functor_ from '../../typeclasses/Functor'
import { SyncResultHkt, SyncResult } from './sync-result'
import { _SyncResult } from './_internal'

export const Functor: Functor_.Functor<SyncResultHkt> = _SyncResult.Functor

export const map: {
  <A, B>(ab: (a: A) => B): <E>(syncResult: SyncResult<A, E>) => SyncResult<B, E>
} = Functor.map

export const as: {
  <A>(a: A): <E>(syncResult: SyncResult<unknown, E>) => SyncResult<A, E>
} = Functor.as

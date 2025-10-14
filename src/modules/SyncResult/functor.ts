import * as Functor_ from '../../typeclasses/Functor'
import { SyncResultHkt, SyncResult } from './sync-result'
import { _SyncResult } from './internal'

export const Functor: Functor_.Functor<SyncResultHkt> = _SyncResult.Functor

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: SyncResult<A, E>) => SyncResult<B, E>
} = Functor.map

import * as Result from '../Result'
import * as Functor_ from '../../typeclasses/Functor'
import { SyncResultHkt, SyncResult, execute } from './sync-result'
import { pipe } from '../../utils/flow'

export const Functor: Functor_.Functor<SyncResultHkt> = {
  map: ab => self => () => pipe(self, execute, Result.map(ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: SyncResult<A, E>) => SyncResult<B, E>
} = Functor.map

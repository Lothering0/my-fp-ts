import * as result from '../Result'
import * as functor from '../../typeclasses/Functor'
import { SyncResultHkt, SyncResult, execute } from './sync-result'
import { pipe } from '../../utils/flow'

export const Functor: functor.Functor<SyncResultHkt> = {
  map: ab => self => () => pipe(self, execute, result.map(ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: SyncResult<E, A>) => SyncResult<E, B>
} = Functor.map

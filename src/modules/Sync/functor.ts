import * as functor from '../../typeclasses/Functor'
import { SyncHkt, Sync, execute } from './sync'
import { pipe } from '../../utils/flow'

export const Functor: functor.Functor<SyncHkt> = {
  map: ab => self => () => pipe(self, execute, ab),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Sync<A>) => Sync<B>
} = Functor.map

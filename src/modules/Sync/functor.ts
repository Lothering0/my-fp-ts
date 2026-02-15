import * as Functor_ from '../../typeclasses/Functor'
import { SyncHkt, Sync, run } from './sync'
import { pipe } from '../../utils/flow'

export const Functor = Functor_.create<SyncHkt>({
  map: ab => sync => () => pipe(sync, run, ab),
})

export const map: {
  <A, B>(ab: (a: A) => B): (sync: Sync<A>) => Sync<B>
} = Functor.map

export const as: {
  <A>(a: A): (sync: Sync<unknown>) => Sync<A>
} = Functor.as

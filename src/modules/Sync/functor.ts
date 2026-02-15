import * as Functor_ from '../../typeclasses/Functor'
import { Hkt, Sync, run } from './sync'
import { pipe } from '../../utils/flow'

export const Functor = Functor_.create<Hkt>({
  map: ab => sync => () => pipe(sync, run, ab),
})

export const map: {
  <A, B>(ab: (a: A) => B): (sync: Sync<A>) => Sync<B>
} = Functor.map

export const as: {
  <A>(a: A): (sync: Sync<unknown>) => Sync<A>
} = Functor.as

import * as Functor_ from '../../typeclasses/Functor'
import { Identity, Hkt } from './identity'

export const Functor = Functor_.create<Hkt>({
  map: ab => a => ab(a),
})

export const map: {
  <A, B>(ab: (a: A) => B): (a: Identity<A>) => Identity<B>
} = Functor.map

export const as: {
  <A>(a: A): (x: Identity<unknown>) => Identity<A>
} = Functor.as

import { Hkt as Hkt_ } from '../../typeclasses/Hkt'

export interface Hkt extends Hkt_ {
  readonly Type: Identity<this['In']>
}

export type Identity<A> = A

export const identity: {
  <A>(a: A): Identity<A>
} = a => a

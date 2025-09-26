import { Hkt } from '../../typeclasses/Hkt'

export interface IdentityHkt extends Hkt {
  readonly Type: Identity<this['In']>
}

export type Identity<A> = A

export const identity: {
  <A>(a: A): Identity<A>
} = a => a

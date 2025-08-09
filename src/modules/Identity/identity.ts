import { Hkt } from "../../types/Hkt"

export interface IdentityHkt extends Hkt {
  readonly type: Identity<this["_A"]>
}

export type Identity<A> = A

export const identity: {
  <A>(a: A): Identity<A>
} = a => a

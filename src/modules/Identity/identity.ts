import { HKT } from "../../types/HKT"

export interface IdentityHKT extends HKT {
  readonly type: Identity<this["_A"]>
}

export declare const _F: IdentityHKT

export type Identity<A> = A

export const identity: {
  <A>(a: A): Identity<A>
} = a => a

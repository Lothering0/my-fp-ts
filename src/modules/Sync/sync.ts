import { HKT } from "../../types/HKT"

export interface SyncHKT extends HKT {
  readonly type: Sync<this["_A"]>
}

export interface Sync<A> {
  (): A
}

export const sync: {
  <A>(a: A): Sync<A>
} = a => () => a

export const execute: {
  <A>(self: Sync<A>): A
} = self => self ()

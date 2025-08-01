import * as sync from "../Sync"
import { HKT } from "../../types/HKT"

export interface AsyncHKT extends HKT {
  readonly type: Async<this["_A"]>
}

export interface Async<A> extends sync.Sync<Promise<A>> {}

export const async: {
  <A>(a: A): Async<A>
} = a => () => Promise.resolve (a)

export const toPromise: {
  <A>(ma: Async<A>): Promise<A>
} = ma => ma ()

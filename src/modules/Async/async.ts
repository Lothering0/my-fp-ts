import { HKT } from "../../types/HKT"
import * as S from "../Sync"

export interface AsyncHKT extends HKT {
  readonly type: Async<this["_A"]>
}

export declare const _F: AsyncHKT

export interface Async<A> extends S.Sync<Promise<A>> {}

export const async: {
  <A>(a: A): Async<A>
} = a => () => Promise.resolve (a)

export const fromAsync: {
  <A>(ma: Async<A>): Promise<A>
} = ma => ma ()

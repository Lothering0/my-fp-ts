import * as A from "../Async"
import * as AR from "../AsyncResult"
import * as R from "../Result"
import * as O from "../Option"
import { HKT } from "../../types/HKT"
import { identity } from "../Identity"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export interface AsyncOptionHKT extends HKT {
  readonly type: AsyncOption<this["_A"]>
}

export declare const _F: AsyncOptionHKT

export interface AsyncOption<A> extends A.Async<O.Option<A>> {}

export const none: AsyncOption<never> = A.of (O.none)

export const some: {
  <A>(a: A): AsyncOption<A>
} = flow (O.some, A.of)

export const toPromise: {
  <A>(ma: AsyncOption<A>): Promise<O.Option<A>>
} = mma => mma ().then (identity, constant (O.none))

export const fromAsync: {
  <A>(ma: A.Async<A>): AsyncOption<A>
} = ma => () => ma ().then (O.some, () => O.none)

export const fromAsyncResult: {
  <E, A>(ma: AR.AsyncResult<E, A>): AsyncOption<A>
} = ma => () => ma ().then (R.match (constant (O.none), O.some), constant (O.none))

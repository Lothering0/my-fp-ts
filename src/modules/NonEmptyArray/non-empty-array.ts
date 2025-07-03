import { HKT } from "../../types/HKT"

export interface NonEmptyArrayHKT extends HKT {
  readonly type: NonEmptyArray<this["_A"]>
}

export declare const _F: NonEmptyArrayHKT

export type NonEmptyArray<A> = [A, ...A[]]

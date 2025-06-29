import { HKT } from "../../types/HKT"

export interface NonEmptyArrayHKT extends HKT {
  readonly type: NonEmptyArray<this["_A"]>
}

export type NonEmptyArray<A> = [A, ...A[]]

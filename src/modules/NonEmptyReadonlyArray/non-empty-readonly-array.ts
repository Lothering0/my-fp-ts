import { HKT } from "../../types/HKT"

export interface NonEmptyReadonlyArrayHKT extends HKT {
  readonly type: NonEmptyReadonlyArray<this["_A"]>
}

export type NonEmptyReadonlyArray<A> = readonly [A, ...ReadonlyArray<A>]

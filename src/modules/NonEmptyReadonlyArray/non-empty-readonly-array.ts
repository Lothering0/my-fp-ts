import { Hkt } from "../../typeclasses/Hkt"

export interface NonEmptyReadonlyArrayHkt extends Hkt {
  readonly type: NonEmptyReadonlyArray<this["_in"]>
}

export type NonEmptyReadonlyArray<A> = readonly [A, ...ReadonlyArray<A>]

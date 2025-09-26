import { Hkt } from "../../typeclasses/Hkt"

export interface NonEmptyReadonlyArrayHkt extends Hkt {
  readonly Type: NonEmptyReadonlyArray<this["In"]>
}

export type NonEmptyReadonlyArray<A> = readonly [A, ...ReadonlyArray<A>]

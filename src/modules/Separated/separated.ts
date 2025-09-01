import { Hkt } from "../../typeclasses/Hkt"

export interface SeparatedHkt extends Hkt {
  readonly type: Separated<this["_collectable"], this["_in"]>
}

export interface Separated<E, A> {
  readonly left: E
  readonly right: A
}

export const left: {
  <E>(fe: Separated<E, unknown>): E
} = fe => fe.left

export const right: {
  <A>(fa: Separated<unknown, A>): A
} = fa => fa.right

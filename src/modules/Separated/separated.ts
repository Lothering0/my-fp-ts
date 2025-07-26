import { HKT } from "../../types/HKT"

export interface SeparatedHKT extends HKT {
  readonly type: Separated<this["_E"], this["_A"]>
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

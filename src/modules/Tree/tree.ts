import { Hkt } from "../../types/Hkt"

export interface TreeHkt extends Hkt {
  readonly type: Tree<this["_A"]>
}

export interface Tree<A> {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = ReadonlyArray<Tree<A>>

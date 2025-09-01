import { Hkt } from "../../typeclasses/Hkt"

export interface TreeHkt extends Hkt {
  readonly type: Tree<this["_in"]>
}

export interface Tree<A> {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = ReadonlyArray<Tree<A>>

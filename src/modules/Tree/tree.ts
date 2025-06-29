import { HKT } from "../../types/HKT"

export interface TreeHKT extends HKT {
  readonly type: Tree<this["_A"]>
}

export interface Tree<A> {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = Tree<A>[]

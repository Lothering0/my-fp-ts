import { Hkt } from '../../typeclasses/Hkt'

export interface TreeHkt extends Hkt {
  readonly Type: Tree<this['In']>
}

export interface Tree<A> extends Iterable<A> {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = Iterable<Tree<A>>

import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { NonEmptyIterable } from '../_internal'

export interface Hkt extends Hkt_ {
  readonly Type: Tree<this['In']>
}

export interface Tree<A> extends NonEmptyIterable<A> {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = Iterable<Tree<A>>

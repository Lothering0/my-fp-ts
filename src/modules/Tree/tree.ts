import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { Pipeable } from '../../utils/flow'
import { NonEmptyIterable } from '../_internal'

export interface Hkt extends Hkt_ {
  readonly Type: Tree<this['In']>
}

export interface Tree<A> extends NonEmptyIterable<A>, Pipeable {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = Iterable<Tree<A>>

import * as boolean from '../Boolean'
import { Predicate } from './predicate'
import { flow } from '../../utils/flow'

export const not: {
  <A>(p: Predicate<A>): Predicate<A>
} = p => flow(p, boolean.not)

export const and: {
  <A>(first: Predicate<A>): (second: Predicate<A>) => Predicate<A>
} = first => second => a => first(a) && second(a)

export const or: {
  <A>(first: Predicate<A>): (second: Predicate<A>) => Predicate<A>
} = first => second => a => first(a) || second(a)

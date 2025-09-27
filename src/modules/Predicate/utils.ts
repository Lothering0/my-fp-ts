import * as Boolean from '../Boolean'
import { Predicate } from './predicate'
import { flow, pipe } from '../../utils/flow'

export const not: {
  <A>(p: Predicate<A>): Predicate<A>
} = p => flow(p, Boolean.not)

export const and: {
  <A>(second: Predicate<A>): (first: Predicate<A>) => Predicate<A>
} = second => first => a => first(a) && second(a)

export const or: {
  <A>(second: Predicate<A>): (first: Predicate<A>) => Predicate<A>
} = second => first => a => first(a) || second(a)

export const xor: {
  <A>(second: Predicate<A>): (first: Predicate<A>) => Predicate<A>
} = second => first => a => pipe(a, first, Boolean.xor(second(a)))

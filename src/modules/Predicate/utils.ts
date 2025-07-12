import * as B from "../Boolean"
import { Predicate } from "./predicate"
import { overload } from "../../utils/overloads"
import { flow } from "../../utils/flow"

export const not: {
  <A>(p: Predicate<A>): Predicate<A>
} = p => flow (p, B.not)

export const and: {
  <A>(second: Predicate<A>): (first: Predicate<A>) => Predicate<A>
  <A>(first: Predicate<A>, second: Predicate<A>): Predicate<A>
} = overload (1, (first, second) => a => first (a) && second (a))

export const or: {
  <A>(second: Predicate<A>): (first: Predicate<A>) => Predicate<A>
  <A>(first: Predicate<A>, second: Predicate<A>): Predicate<A>
} = overload (1, (first, second) => a => first (a) || second (a))

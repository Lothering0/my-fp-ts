import * as List from './list'
import { Monoid } from '../../typeclasses/Monoid'
import { getConcatSemigroup } from './semigroup'

export const empty: List.List<never> = List.nil()

export const getConcatMonoid = <A>(): Monoid<List.List<A>> => ({
  ...getConcatSemigroup(),
  empty,
})

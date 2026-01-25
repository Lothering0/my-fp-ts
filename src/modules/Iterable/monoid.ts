import { Monoid } from '../../typeclasses/Monoid'
import { getConcatSemigroup } from './semigroup'

export const empty: Iterable<never> = []

export const getConcatMonoid = <A>(): Monoid<Iterable<A>> => ({
  ...getConcatSemigroup(),
  empty,
})

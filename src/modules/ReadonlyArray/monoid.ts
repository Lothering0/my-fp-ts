import { Monoid } from '../../typeclasses/Monoid'
import { getConcatSemigroup } from './semigroup'

export const empty: ReadonlyArray<never> = []

export const getConcatMonoid = <A>(): Monoid<ReadonlyArray<A>> => ({
  ...getConcatSemigroup(),
  empty,
})

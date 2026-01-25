import { Monoid } from '../../typeclasses/Monoid'
import { _emptyChunk } from './_internal'
import { Chunk } from './chunk'
import { getConcatSemigroup } from './semigroup'

export const empty: Chunk<never> = _emptyChunk

export const getConcatMonoid = <A>(): Monoid<Chunk<A>> => ({
  ...getConcatSemigroup(),
  empty,
})

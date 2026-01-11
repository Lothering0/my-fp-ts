import { NonEmpty, ChunkHkt } from './chunk'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { createSingletonChunk } from './_internal'

export const FromIdentity: FromIdentity_<ChunkHkt> = {
  of: createSingletonChunk,
}

export const of = <A>(a: A): NonEmpty<A> => FromIdentity.of(a) as NonEmpty<A>

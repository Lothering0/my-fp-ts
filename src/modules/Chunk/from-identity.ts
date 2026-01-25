import * as Chunk from './chunk'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { createSingletonChunk } from './_internal'

export const of = <A>(a: A): Chunk.NonEmpty<A> => createSingletonChunk(a)

export const FromIdentity: FromIdentity_<Chunk.Hkt> = {
  of,
}

export const NonEmptyFromIdentity: FromIdentity_<Chunk.NonEmptyHkt> = {
  of,
}

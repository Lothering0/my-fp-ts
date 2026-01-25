import * as Chunk from './chunk'
import * as Alt_ from '../../typeclasses/Alt'
import { concat } from './utils'

export const orElse =
  <F extends Chunk.Chunk<any>>(chunk: F) =>
  <G extends Chunk.Chunk<any>>(selfChunk: G): Chunk.OrNonEmpty<F, G> =>
    concat(chunk)(selfChunk)

export const Alt: Alt_.Alt<Chunk.Hkt> = {
  orElse,
}

export const NonEmptyAlt: Alt_.Alt<Chunk.NonEmptyHkt> = {
  orElse,
}

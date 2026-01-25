import * as Alternative_ from '../../typeclasses/Alternative'
import * as Chunk from './chunk'
import { Alt } from './alt'
import { _emptyChunk } from './_internal'

export const zero: {
  <A>(): Chunk.Chunk<A>
} = () => _emptyChunk

export const Alternative: Alternative_.Alternative<Chunk.Hkt> = {
  ...Alt,
  zero,
}

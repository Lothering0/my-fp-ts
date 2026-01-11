import { isRecord } from '../../utils/typeChecks'
import { Chunk, EmptyChunk, NonEmpty } from './chunk'

export const isChunk = (x: unknown): x is Chunk<unknown> =>
  isRecord(x) && x?._id === 'Chunk'

export const isEmpty = <A>(chunk: Chunk<A>): chunk is EmptyChunk<A> =>
  chunk.length === 0

export const isNonEmpty = <A>(chunk: Chunk<A>): chunk is NonEmpty<A> =>
  '0' in chunk

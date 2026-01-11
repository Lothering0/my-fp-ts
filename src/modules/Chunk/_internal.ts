import * as Array from '../ReadonlyArray'
import { Chunk, NonEmpty } from './chunk'

export const _emptyChunk: Chunk<never> = Object.freeze<Chunk<never>>({
  _id: 'Chunk',
  _tag: 'EmptyChunk',
  length: 0,
  *[Symbol.iterator]() {},
})

export const createSingletonChunk = <A>(a: A): NonEmpty<A> =>
  Object.freeze<NonEmpty<A>>({
    _id: 'Chunk',
    _tag: 'SingletonChunk',
    length: 1,
    a,
    0: a,
    *[Symbol.iterator]() {
      yield a
    },
  })

export const createArrayChunk = <A>(array: Array.NonEmpty<A>): NonEmpty<A> =>
  Object.freeze<NonEmpty<A>>({
    _id: 'Chunk',
    _tag: 'ArrayChunk',
    length: array.length,
    array,
    0: array[0],
    *[Symbol.iterator]() {
      yield* array
    },
  })

export const createSliceChunk = <A>(
  chunk: NonEmpty<A>,
  skip: number,
  take: number,
): NonEmpty<A> =>
  Object.freeze<NonEmpty<A>>({
    _id: 'Chunk',
    _tag: 'SliceChunk',
    length: take,
    skip,
    chunk,
    0: chunk[0],
    *[Symbol.iterator]() {
      let i = -1
      for (const a of chunk) {
        i++
        if (i < skip) {
          continue
        }
        yield a
        if (i >= take) {
          break
        }
      }
    },
  })

export const createConcatChunk = <A>(
  start: NonEmpty<A>,
  end: NonEmpty<A>,
): NonEmpty<A> =>
  Object.freeze<NonEmpty<A>>({
    _id: 'Chunk',
    _tag: 'ConcatChunk',
    length: start.length + end.length,
    0: start[0],
    start,
    end,
    *[Symbol.iterator]() {
      yield* start
      yield* end
    },
  })

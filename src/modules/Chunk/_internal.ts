import * as Array from '../ReadonlyArray'
import { nonEmpty, pipe } from '../_internal'
import { Chunk, NonEmpty } from './chunk'

export const _emptyChunk: Chunk<never> = Object.freeze<Chunk<never>>({
  _id: 'Chunk',
  _tag: 'EmptyChunk',
  length: 0,
  pipe,
  *[Symbol.iterator]() {},
})

export const createSingletonChunk = <A>(a: A): NonEmpty<A> =>
  Object.freeze<NonEmpty<A>>({
    [nonEmpty]: undefined,
    _id: 'Chunk',
    _tag: 'SingletonChunk',
    length: 1,
    a,
    pipe,
    *[Symbol.iterator]() {
      yield a
    },
  })

export const createArrayChunk = <A>(array: Array.NonEmpty<A>): NonEmpty<A> =>
  Object.freeze<NonEmpty<A>>({
    [nonEmpty]: undefined,
    _id: 'Chunk',
    _tag: 'ArrayChunk',
    length: array.length,
    array,
    pipe,
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
    [nonEmpty]: undefined,
    _id: 'Chunk',
    _tag: 'SliceChunk',
    length: take,
    skip,
    chunk,
    pipe,
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
    [nonEmpty]: undefined,
    _id: 'Chunk',
    _tag: 'ConcatChunk',
    length: start.length + end.length,
    start,
    end,
    pipe,
    *[Symbol.iterator]() {
      yield* start
      yield* end
    },
  })

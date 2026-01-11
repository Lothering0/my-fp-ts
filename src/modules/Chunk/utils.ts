import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import * as Array from '../ReadonlyArray'
import * as Option from '../Option'
import {
  _emptyChunk,
  createArrayChunk,
  createConcatChunk,
  createSingletonChunk,
} from './_internal'
import { isEmpty, isNonEmpty } from './refinements'
import { pipe } from '../../utils/flow'
import { PredicateWithIndex } from '../Predicate'

export const fromIterable = <F extends Iterable<any>>(
  iterable: F,
): F extends Iterable.NonEmpty<infer A>
  ? Chunk.NonEmpty<A>
  : F extends Iterable<infer A>
    ? Chunk.Chunk<A>
    : never => {
  const array = Iterable.toReadonlyArray(iterable)
  return (
    Array.isNonEmpty(array) ? createArrayChunk(array) : _emptyChunk
  ) as any
}

export const length: {
  (chunk: Chunk.Chunk<unknown>): number
} = chunk => chunk.length

export const has: {
  (i: number): <A>(chunk: Chunk.Chunk<A>) => boolean
} = i => chunk => Number.isInteger(i) && i >= 0 && i < chunk.length

export const isOutOfBounds: {
  (i: number): <A>(chunk: Chunk.Chunk<A>) => boolean
} = i => chunk => !has(i)(chunk)

export const lastIndex: {
  (chunk: Chunk.Chunk<unknown>): number
} = chunk => chunk.length - 1

export const head = <A>(chunk: Chunk.Chunk<A>): Option.Option<A> =>
  Iterable.head(chunk)

export const headNonEmpty = <A>(chunk: Chunk.NonEmpty<A>): A =>
  Iterable.headNonEmpty(chunk)

export const tailNonEmpty = <A>(chunk: Chunk.NonEmpty<A>): Chunk.Chunk<A> => {
  switch (chunk._tag) {
    case 'ArrayChunk':
      return pipe(
        chunk.array,
        Array.tailNonEmpty,
        Array.match({
          onNonEmpty: createArrayChunk,
          onEmpty: () => _emptyChunk,
        }),
      )

    case 'ConcatChunk':
    case 'SliceChunk':
      return pipe(chunk, Iterable.tailNonEmpty, fromIterable)

    case 'SingletonChunk':
      return _emptyChunk
  }
}

export const tail = <A>(
  chunk: Chunk.Chunk<A>,
): Option.Option<Chunk.Chunk<A>> =>
  isNonEmpty(chunk) ? pipe(chunk, tailNonEmpty, Option.some) : Option.none()

export const initNonEmpty = <A>(chunk: Chunk.NonEmpty<A>): Chunk.Chunk<A> => {
  switch (chunk._tag) {
    case 'ArrayChunk':
      return pipe(
        chunk.array,
        Array.initNonEmpty,
        Array.match({
          onNonEmpty: createArrayChunk,
          onEmpty: () => _emptyChunk,
        }),
      )

    case 'ConcatChunk':
    case 'SliceChunk':
      return pipe(chunk, Iterable.initNonEmpty, fromIterable)

    case 'SingletonChunk':
      return _emptyChunk
  }
}

export const init = <A>(
  chunk: Chunk.Chunk<A>,
): Option.Option<Chunk.Chunk<A>> =>
  isNonEmpty(chunk) ? pipe(chunk, initNonEmpty, Option.some) : Option.none()

export const lastNonEmpty = <A>(chunk: Chunk.NonEmpty<A>): A => {
  switch (chunk._tag) {
    case 'SingletonChunk':
      return chunk.a

    case 'ConcatChunk':
      return lastNonEmpty(chunk.end)

    case 'SliceChunk':
      return Iterable.lastNonEmpty(chunk)

    case 'ArrayChunk':
      return Array.lastNonEmpty(chunk.array)
  }
}

export const last = <A>(chunk: Chunk.Chunk<A>): Option.Option<A> =>
  isNonEmpty(chunk) ? pipe(chunk, lastNonEmpty, Option.some) : Option.none()

export const append =
  <A>(chunk: Chunk.Chunk<A>) =>
  (a: A): Chunk.NonEmpty<A> =>
    isNonEmpty(chunk)
      ? createConcatChunk(chunk, createSingletonChunk(a))
      : createSingletonChunk(a)

export const prepend =
  <A>(chunk: Chunk.Chunk<A>) =>
  (a: A): Chunk.NonEmpty<A> =>
    isNonEmpty(chunk)
      ? createConcatChunk(createSingletonChunk(a), chunk)
      : createSingletonChunk(a)

export const concat =
  <F extends Chunk.Chunk<any>>(end: F) =>
  <G extends Chunk.Chunk<any>>(start: G): Chunk.OrNonEmpty<F, G> => {
    if (isEmpty(end)) {
      return start as Chunk.OrNonEmpty<F, G>
    }
    if (isEmpty(start)) {
      return end as Chunk.OrNonEmpty<F, G>
    }
    return createConcatChunk(start, end)
  }

export const reverse = <F extends Chunk.Chunk<any>>(
  chunk: F,
): Chunk.With<F> => {
  switch (chunk._tag) {
    case 'ArrayChunk':
      return pipe(chunk.array, Array.reverse, createArrayChunk)

    case 'SliceChunk':
      return pipe(
        chunk,
        Iterable.toReadonlyArray<Chunk.Infer<F>>,
        Array.reverse,
        createArrayChunk,
      )

    case 'ConcatChunk':
      return createConcatChunk(reverse(chunk.end), reverse(chunk.start))

    default:
      return chunk as Chunk.With<F>
  }
}

export const lookup: {
  (i: number): <A>(chunk: Chunk.Chunk<A>) => Option.Option<A>
} = i => chunk => {
  if (chunk._tag === 'ConcatChunk') {
    return i < chunk.start.length
      ? Iterable.lookup(i)(chunk.start)
      : Iterable.lookup(i - chunk.start.length)(chunk.end)
  }
  return Iterable.lookup(i)(chunk)
}

export const takeWhile =
  <A>(p: PredicateWithIndex<A, number>) =>
  (chunk: Chunk.Chunk<A>): Chunk.Chunk<A> =>
    pipe(chunk, Iterable.takeWhile(p), fromIterable)

export const take =
  (n: number) =>
  <A>(chunk: Chunk.Chunk<A>): Chunk.Chunk<A> =>
    pipe(chunk, Iterable.take(n), fromIterable)

export const dropWhile =
  <A>(p: PredicateWithIndex<A, number>) =>
  (chunk: Chunk.Chunk<A>): Chunk.Chunk<A> =>
    pipe(chunk, Iterable.dropWhile(p), fromIterable)

export const drop =
  (n: number) =>
  <A>(chunk: Chunk.Chunk<A>): Chunk.Chunk<A> =>
    pipe(chunk, Iterable.drop(n), fromIterable)

export const chunksOf =
  (n: number) =>
  <A>(chunk: Chunk.Chunk<A>): Chunk.Chunk<Chunk.Chunk<A>> =>
    pipe(chunk, Iterable.chunksOf(n), Iterable.map(fromIterable), fromIterable)

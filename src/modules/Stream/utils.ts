import * as Stream from './stream'
import * as Iterable from '../Iterable'
import * as Effect from '../Effect'
import * as Chunk from '../Chunk'
import * as Result from '../Result'
import { pipe } from '../../utils/flow'

export const fromIterable = <A>(iterable: Iterable<A>): Stream.Stream<A> =>
  Stream.create(({ push, finish }) => () => {
    for (const a of iterable) {
      push(a)
    }
    finish()
  })

export const make = <A>(...as: ReadonlyArray<A>): Stream.Stream<A> =>
  fromIterable(as)

export const succeed = <A>(a: A): Stream.Stream<A> => make(a)

export const fail = <E>(e: E): Stream.Stream<never, E> =>
  Stream.create(
    ({ fail }) =>
      () =>
        fail(e),
  )

export const toChunk = <A, E, R>(
  stream: Stream.Stream<A, E, R>,
): Effect.Effect<Chunk.Chunk<A>, E, R> =>
  pipe(
    stream,
    Effect.mapResult(result => () => {
      if (Result.isFailure(result)) {
        return result
      }
      const streamable = result.success
      if (streamable._isFinished) {
        return streamable._result
      }
      return new Promise(resolve => {
        streamable._consumers.push({
          onFinish: () => resolve(streamable._result),
          onFail: () => resolve(streamable._result),
        })
      })
    }),
  )

export const toReadonlyArray = <A, E, R>(
  stream: Stream.Stream<A, E, R>,
): Effect.Effect<ReadonlyArray<A>, E, R> =>
  pipe(
    stream,
    toChunk,
    Effect.map(a => Iterable.toReadonlyArray(a)),
  )

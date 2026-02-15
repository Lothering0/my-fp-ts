import * as Stream from './stream'
import * as Effect from '../Effect'
import * as Chunk from '../Chunk'
import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { Functor, FunctorWithIndex } from './functor'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { toChunk } from './utils'
import { listen } from './_internal'

export const Monad = Monad_.create<Stream.Hkt>(FromIdentity, Functor, {
  flat: <A, E1, E2, R>(
    streamOfStreams: Stream.Stream<Stream.Stream<A, E1, R>, E2, R>,
  ) =>
    pipe(
      streamOfStreams,
      toChunk,
      Effect.flatMap(chunk =>
        Stream.create<A, E1 | E2>(({ push, fail, finish }) => r => {
          const next = (chunk: Chunk.Chunk<Stream.Stream<A, E1 | E2, R>>) =>
            pipe(
              chunk,
              Chunk.matchLeft({
                onNonEmpty: (stream, tail) => {
                  pipe(
                    stream,
                    Effect.map(streamable => {
                      pipe(
                        streamable,
                        listen({
                          onPush: push,
                          onFail: fail,
                          onFinish: () => next(tail),
                        }),
                      )
                    }),
                    Effect.run(r),
                  )
                },
                onEmpty: finish,
              }),
            )
          next(chunk)
        }),
      ),
    ),
})

export const MonadWithIndex = MonadWithIndex_.create<Stream.Hkt, number>(
  FunctorWithIndex,
  Monad,
)

export const Do = Monad.Do

export const flat: {
  <A, E1, E2, R>(
    stream: Stream.Stream<Stream.Stream<A, E2, R>, E1, R>,
  ): Stream.Stream<A, E1 | E2, R>
} = Monad.flat

export const flatMap: {
  <A, B, E1, R>(
    amb: (a: A, i: number) => Stream.Stream<B, E1, R>,
  ): <E2>(stream: Stream.Stream<A, E2, R>) => Stream.Stream<B, E1 | E2, R>
} = MonadWithIndex.flatMapWithIndex

export const andThen: {
  <A, E1, R>(
    ma: Stream.Stream<A, E1, R>,
  ): <E2>(stream: Stream.Stream<unknown, E2, R>) => Stream.Stream<A, E1 | E2, R>
} = Monad.andThen

export const compose: {
  <E1, E2, A, B, C, R>(
    amb: (a: A) => Stream.Stream<B, E1, R>,
    bmc: (b: B, i: number) => Stream.Stream<C, E2, R>,
  ): (a: A) => Stream.Stream<C, E1 | E2, R>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E, R>(
    stream: Stream.Stream<A, E, R>,
  ) => Stream.Stream<DoObject<N, A, B>, E, R>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: number) => B,
  ): <E, R>(
    stream: Stream.Stream<A, E, R>,
  ) => Stream.Stream<DoObject<N, A, B>, E, R>
} = MonadWithIndex.mapToWithIndex

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    fab: Stream.Stream<(a: A, i: number) => B, E1, R>,
  ): <E2>(
    stream: Stream.Stream<A, E2, R>,
  ) => Stream.Stream<DoObject<N, A, B>, E1 | E2, R>
} = MonadWithIndex.flipApplyToWithIndex

export const bind: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    fb: Stream.Stream<B, E1, R>,
  ): <E2>(
    stream: Stream.Stream<A, E2, R>,
  ) => Stream.Stream<DoObject<N, A, B>, E1 | E2, R>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => Stream.Stream<B, E1, R>,
  ): <E2>(
    self: Stream.Stream<A, E2, R>,
  ) => Stream.Stream<DoObject<N, A, B>, E1 | E2, R>
} = MonadWithIndex.flatMapToWithIndex
